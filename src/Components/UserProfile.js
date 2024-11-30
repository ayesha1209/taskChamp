import { useEffect, useState } from "react";
import { User } from "../models/User";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    birthdate: "",
    country: "",
    email: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlPreview, setImageUrlPreview] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const fetchedUser = await User.fetch(userId);
        setUser(fetchedUser);

        if (fetchedUser.imageUrl) {
          // Fetch the download URL to get the latest version
          const storage = getStorage();
          const storageRef = ref(storage, fetchedUser.imageUrl);
          const imageUrl = await getDownloadURL(storageRef);
          setImageUrlPreview(`${imageUrl}?t=${new Date().getTime()}`); // Append timestamp to force reload
        }

        const [day, month, year] = fetchedUser.birthdate.split("-");
        const formattedDate = `${year}-${month}-${day}`;
        setFormData({
          username: fetchedUser.username,
          password: fetchedUser.password,
          birthdate: formattedDate,
          country: fetchedUser.country,
          email: fetchedUser.email,
          imageUrl: fetchedUser.imageUrl,
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    setImageUrlPreview(URL.createObjectURL(e.target.files[0])); // Update preview immediately
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update the image if a new file was chosen
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(storage, `userProfiles/${userId}`);
        await uploadBytes(storageRef, imageFile);
        const newImageUrl = await getDownloadURL(storageRef);
        formData.imageUrl = `userProfiles/${userId}`; // Update `formData` with the image path
        setImageUrlPreview(`${newImageUrl}?t=${new Date().getTime()}`);
        user.imageUrl = formData.imageUrl; // Update user instance as well
      }

      const [year, month, day] = formData.birthdate.split("-");
      const formattedBirthdate = `${day}-${month}-${year}`;

      user.username = formData.username;
      user.password = formData.password;
      user.birthdate = formattedBirthdate;
      user.country = formData.country;
      user.email = formData.email;
      await user.save();
      alert("Profile updated successfully!");
      setUser({ ...user });
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-4xl p-6 bg-white shadow-md rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Section - Form */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">User Profile</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {imageUrlPreview && (
                <div className="flex justify-center mb-4">
                  <img
                    src={imageUrlPreview}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-2 border-gray-300 object-cover"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600">Username:</label>
                <input
                  type="text"
                  name="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email:</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Password:</label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-sm text-indigo-500"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Birthdate:</label>
                <input
                  type="date"
                  name="birthdate"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  value={formData.birthdate}
                  onChange={(e) =>
                    setFormData({ ...formData, birthdate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Country:</label>
                <input
                  type="text"
                  name="country"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Profile Image:</label>
                <input
                  type="file"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
                  onChange={handleImageChange}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
              >
                Update Profile
              </button>
            </form>
          </div>
  
          {/* Right Section - Placeholder (optional) */}
          <div className="hidden md:block">
            {/* You can add additional content or leave this empty */}
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default UserProfile;
