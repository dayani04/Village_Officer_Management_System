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
    Type VARCHAR(255) NOT NULL
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


CREATE TABLE Allowances_recode (
     Allowances_ID VARCHAR(50) PRIMARY KEY,
     Allowances_Type VARCHAR(255) NOT NULL
);


INSERT INTO allowances_recode (Allowances_ID,Allowances_Type) VALUES (1, 'Adult Allowances'), (2, 'Disabled Allowances'), (3,'Widow Allowances'), (4,'Nutritional And Food Allowance'), (5,'Agriculture And Farming Subsidies Allowances');


CREATE TABLE villager_has_allowances_recode (
    Villager_ID VARCHAR(50),
     Allowances_ID VARCHAR(50),
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255), -- Stores file path for PDF, PNG, or photo
    PRIMARY KEY (Villager_ID, Allowances_ID), -- Composite primary key
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY (Allowances_ID) REFERENCES Allowances_recode(Allowances_ID) ON DELETE CASCADE
);


CREATE TABLE Permits_recode (
     Permits_ID VARCHAR(50) PRIMARY KEY,
     Permits_Type VARCHAR(255) NOT NULL
);
INSERT INTO Permits_recode (Permits_ID,Permits_Type)
 VALUES (1, 'Sand Permit'), 
 (2, 'Tree Cutting Permit'), 
 (3,'Land Use Permit'), 
 (4,'Vehicle Travel Permit');


 CREATE TABLE villager_has_Permits_recode (
    Villager_ID VARCHAR(50),
    Permits_ID VARCHAR(50),
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255), -- Stores file path for PDF, PNG, or photo
    PRIMARY KEY (Villager_ID, Permits_ID), -- Composite primary key
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY (Permits_ID) REFERENCES Permits_recode(Permits_ID) ON DELETE CASCADE
);
ALTER TABLE villager_has_Permits_recode ADD COLUMN police_report_path VARCHAR(255);


CREATE TABLE villager_has_certificate_recode (
    Villager_ID VARCHAR(50),
    application_id INT AUTO_INCREMENT,
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255),
    PRIMARY KEY (application_id),
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE
);


CREATE TABLE nic_recode (
     NIC_ID VARCHAR(50) PRIMARY KEY,
     NIC_Type VARCHAR(255) NOT NULL
);
INSERT INTO nic_recode (NIC_ID , NIC_Type)
 VALUES (1, 'postal ID Card'), 
 (2, 'National ID Card');


 CREATE TABLE villager_has_nic_recode (
    Villager_ID VARCHAR(50),
     NIC_ID VARCHAR(50),
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255), -- Stores file path for PDF, PNG, or photo
    PRIMARY KEY (Villager_ID,  NIC_ID), -- Composite primary key
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY ( NIC_ID) REFERENCES nic_recode( NIC_ID) ON DELETE CASCADE
);