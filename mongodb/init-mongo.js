db = db.getSiblingDB('adboard');

// Create collections
db.createCollection('users');
db.createCollection('campaigns');
db.createCollection('devices');
db.createCollection('contents');

// Insert admin user
db.users.insertOne({
    username: "admin",
    email: "admin@adboard.com",
    password: "$2b$10$HFl8NMnrbej1dKt6uK2N6uQ5PVXQzTH7HzQ5jL3XdRH0UQjkV4hwy", // hashed "adminpassword"
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insert sample device
db.devices.insertOne({
    name: "Display-001",
    location: "Reception",
    status: "online",
    lastSeen: new Date(),
    screenOrientation: "landscape",
    screenResolution: "1920x1080",
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insert sample campaign
db.campaigns.insertOne({
    name: "Welcome Campaign",
    description: "Display welcome messages for visitors",
    status: "active",
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    targetDevices: ["Display-001"],
    createdAt: new Date(),
    updatedAt: new Date()
});

// Insert sample content
db.contents.insertOne({
    title: "Welcome Message",
    contentType: "image",
    url: "/uploads/welcome.jpg",
    duration: 10,
    campaignId: db.campaigns.findOne({ name: "Welcome Campaign" })._id,
    createdAt: new Date(),
    updatedAt: new Date()
});

print("Database initialized with sample data");
