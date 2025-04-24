CREATE TABLE Villager (
    Villager_ID VARCHAR(50) PRIMARY KEY, -- Assuming villager_id is a string based on usage
    Full_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL, -- Hashed password
    Phone_No VARCHAR(20) NOT NULL,
    NIC VARCHAR(20), -- National ID, optional based on code
    DOB DATE, -- Date of birth, optional
    Address TEXT, -- Optional
    ReginalDivision VARCHAR(100), -- Typo in code: should be RegionalDivision
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    Area_ID VARCHAR(50), -- Foreign key or identifier for area
    FOREIGN KEY (Area_ID) REFERENCES Area(Area_ID) -- Assuming Area table exists
);

CREATE TABLE Area (
    Area_ID VARCHAR(50) PRIMARY KEY,
    ZipCode VARCHAR(20) NOT NULL
);
