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
ALTER TABLE Villager CHANGE ReginalDivision RegionalDivision VARCHAR(100);

CREATE TABLE Area (
    Area_ID VARCHAR(50) PRIMARY KEY,
    ZipCode VARCHAR(20) NOT NULL
);
CREATE TABLE Villager_Officer (
    Villager_Officer_ID VARCHAR(50) PRIMARY KEY, -- Assuming villager_id is a string based on usage
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
ALTER TABLE Villager_Officer CHANGE ReginalDivision RegionalDivision VARCHAR(100);

CREATE TABLE Secretary (
    Secretary_ID VARCHAR(50) PRIMARY KEY, -- Assuming villager_id is a string based on usage
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
ALTER TABLE Secretary CHANGE ReginalDivision RegionalDivision VARCHAR(100);

CREATE TABLE Election_recode (
    ID INT PRIMARY KEY
);

INSERT INTO Election_recode (ID, type) VALUES 
(1, 'Presidential Election'),
(2, 'Parliament Election'),
(3,'Local Election'),
(4,'Division Election');


CREATE TABLE villager_hase_election_recode (
    Villager_ID VARCHAR(50),
    electionrecodeID INT,
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255), -- Stores file path for PDF, PNG, or photo
    PRIMARY KEY (Villager_ID, electionrecodeID), -- Composite primary key
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY (electionrecodeID) REFERENCES Election_recode(ID) ON DELETE CASCADE
);