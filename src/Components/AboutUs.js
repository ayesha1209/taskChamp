import React from "react";
import "./AboutUs.module.css"; // Include the CSS file for styling

const AboutUs = () => {
  return (
    <div className="about-container">
      {/* Header Section */}
      <header className="about-header">
        <h1>About Us</h1>
        <p>
          Welcome to [Your Organization's Name]! Get to know more about our
          values, mission, and team.
        </p>
      </header>

      {/* Mission Section */}
      <section className="mission-section">
        <h2 className="about-h2">Our Mission</h2>
        <p>
          Our mission is to [describe your mission]. We strive to
          [objective/goal] and are dedicated to [values or purpose].
        </p>
      </section>

      {/* Vision Section */}
      <section className="vision-section">
        <h2 className="about-h2">Our Vision</h2>
        <p>
          Our vision is to create a [describe your vision] by [strategic
          initiatives or long-term goals].
        </p>
      </section>

      {/* History Section */}
      <section className="history-section">
        <h2 className="about-h2">Our History</h2>
        <p>
          Founded in [year], [Your Organization's Name] has grown from [starting
          point] to a [current position]. Over the years, we have [achievements,
          growth, etc.].
        </p>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {/* Example Team Members */}
          <div className="team-member">
            <img src="path/to/image1.jpg" alt="Team Member 1" />
            <h3>John Doe</h3>
            <p>Chief Executive Officer</p>
          </div>
          <div className="team-member">
            <img src="path/to/image2.jpg" alt="Team Member 2" />
            <h3>Jane Smith</h3>
            <p>Lead Developer</p>
          </div>
          {/* Add more team members as needed */}
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <h2 className="about-h2">Get in Touch</h2>
        <p>If you'd like to reach out, feel free to contact us at:</p>
        <ul>
          <li>Email: contact@yourwebsite.com</li>
          <li>Phone: +123 456 7890</li>
          <li>Address: 123 Main St, Your City, Your Country</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
