import UserService from "./services/postgres/UserService.js";

const test = async () => {
    const userService = new UserService();

    const userId = await userService.addUser({
        name: "Yahya",
        email: "yahya@mail.com",
        password: "123456",
    });

    console.log("User created:", userId);
};

test();
