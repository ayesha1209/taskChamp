import { createUser, addTask } from "./FirebaseOperations";
import { User } from "./models/User";
import { Task } from "./models/Task";
import { ref, set } from "firebase/database";

jest.mock("firebase/database", () => ({
  ref: jest.fn(),
  set: jest.fn(),
}));

describe("Firebase Operations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a user in Firebase", async () => {
    const user = new User(
      "userId1",
      "username",
      "password",
      "01-01-2000",
      "CountryName"
    );

    ref.mockReturnValue("mockRef");
    set.mockResolvedValueOnce("mockResponse");

    await createUser(user);

    expect(ref).toHaveBeenCalledWith("users/userId1");
    expect(set).toHaveBeenCalledWith("mockRef", {
      username: "username",
      password: "password",
      birthdate: "01-01-2000",
      country: "CountryName",
      tasks: user.tasks,
    });
  });

  it("should add a task to a user in Firebase", async () => {
    const task = new Task(
      "taskId1",
      "01-09-2024",
      "Example Task",
      "medium",
      false
    );

    ref.mockReturnValue("mockRef");
    set.mockResolvedValueOnce("mockResponse");

    await addTask("userId1", task);

    expect(ref).toHaveBeenCalledWith("users/userId1/tasks/taskId1");
    expect(set).toHaveBeenCalledWith("mockRef", {
      date: "01-09-2024",
      taskname: "Example Task",
      level: "medium",
      is_done: false,
    });
  });
});
