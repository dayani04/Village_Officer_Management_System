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
-- Assuming your Villager table already exists
ALTER TABLE Villager
ADD COLUMN Latitude DECIMAL(10, 8),
ADD COLUMN Longitude DECIMAL(11, 8);
ADD Alive_Status ENUM('Alive', 'Deceased') DEFAULT 'Alive';

-- Assuming your Villager table already exists
ALTER TABLE Villager
ADD COLUMN IsParticipant BOOLEAN DEFAULT FALSE; -- Or TINYINT(1) DEFAULT 0; depending on your SQL database

ALTER TABLE villager
ADD Job VARCHAR(100);

ALTER TABLE Villager
ADD Gender ENUM('Male', 'Female', 'Other') DEFAULT 'Other';

ALTER TABLE Villager
ADD Marital_Status ENUM('Married', 'Unmarried', 'Divorced', 'Widowed', 'Separated') DEFAULT 'Unmarried';

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




CREATE TABLE Allowances_recode (
     Allowances_ID VARCHAR(50) PRIMARY KEY,
     Allowances_Type VARCHAR(255) NOT NULL
);


INSERT INTO allowances_recode (Allowances_ID,Allowances_Type) VALUES (1, 'Adult Allowances'), (2, 'Disabled Allowances'), (3,'Widow Allowances'), (4,'Nutritional And Food Allowance'), (5,'Agriculture And Farming Subsidies Allowances');




CREATE TABLE Permits_recode (
     Permits_ID VARCHAR(50) PRIMARY KEY,
     Permits_Type VARCHAR(255) NOT NULL
);
INSERT INTO Permits_recode (Permits_ID,Permits_Type)
 VALUES (1, 'Sand Permit'), 
 (2, 'Tree Cutting Permit'), 
 (3,'Land Use Permit'), 
 (4,'Vehicle Travel Permit');



ALTER TABLE villager_has_Permits_recode MODIFY status ENUM('Pending', 'Send', 'Rejected', 'Confirm') DEFAULT 'Pending';




CREATE TABLE nic_recode (
     NIC_ID VARCHAR(50) PRIMARY KEY,
     NIC_Type VARCHAR(255) NOT NULL
);
INSERT INTO nic_recode (NIC_ID , NIC_Type)
 VALUES (1, 'postal ID Card'), 
 (2, 'National ID Card');





DROP TABLE villager_hase_election_recode;
CREATE TABLE villager_hase_election_recode_new (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    Villager_ID VARCHAR(50),
    electionrecodeID INT,
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255),
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY (electionrecodeID) REFERENCES Election_recode(ID) ON DELETE CASCADE
);
ALTER TABLE villager_hase_election_recode_new RENAME TO villager_hase_election_recode;
ALTER TABLE villager_hase_election_recode MODIFY status ENUM('Pending', 'Send', 'Rejected', 'Confirm') DEFAULT 'Pending';


DROP TABLE villager_has_permits_recode;
CREATE TABLE villager_has_permits_recode (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    Villager_ID VARCHAR(50),
    Permits_ID VARCHAR(50),
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255),
    police_report_path VARCHAR(255),
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY (Permits_ID) REFERENCES Permits_recode(Permits_ID) ON DELETE CASCADE
);
ALTER TABLE villager_has_permits_recode MODIFY status ENUM('Pending', 'Send', 'Rejected', 'Confirm') DEFAULT 'Pending';


DROP TABLE villager_has_nic_recode;
CREATE TABLE villager_has_nic_recode (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    Villager_ID VARCHAR(50),
    NIC_ID VARCHAR(50),
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Send', 'Rejected', 'Confirm') DEFAULT 'Pending',
    document_path VARCHAR(255),
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY (NIC_ID) REFERENCES nic_recode(NIC_ID) ON DELETE CASCADE
);



DROP TABLE villager_has_allowances_recode;
CREATE TABLE villager_has_allowances_recode (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    Villager_ID VARCHAR(50),
    Allowances_ID VARCHAR(50),
    apply_date DATE NOT NULL,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    document_path VARCHAR(255),
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE,
    FOREIGN KEY (Allowances_ID) REFERENCES  Allowances_recode(Allowances_ID) ON DELETE CASCADE
);
ALTER TABLE  villager_has_allowances_recode MODIFY status ENUM('Pending', 'Send', 'Rejected', 'Confirm') DEFAULT 'Pending';

CREATE TABLE Notification (
    Notification_ID INT AUTO_INCREMENT PRIMARY KEY,
    Villager_ID VARCHAR(50) NOT NULL,
    Message TEXT NOT NULL,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    Is_Read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (Villager_ID) REFERENCES Villager(Villager_ID) ON DELETE CASCADE
);


CREATE TABLE EmailRegistry (
    Email VARCHAR(100) PRIMARY KEY,
    UserType ENUM('Villager_Officer', 'Secretary') NOT NULL,
    UserID VARCHAR(50) NOT NULL
);



-- Recreate Villager_Officer table
CREATE TABLE Villager_Officer (
    Villager_Officer_ID VARCHAR(50) PRIMARY KEY,
    Full_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone_No VARCHAR(20) NOT NULL,
    NIC VARCHAR(20),
    DOB DATE,
    Address TEXT,
    RegionalDivision VARCHAR(100),
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    Area_ID VARCHAR(50),
    FOREIGN KEY (Area_ID) REFERENCES Area(Area_ID),
    FOREIGN KEY (Email) REFERENCES EmailRegistry(Email)
);

-- Recreate Secretary table
CREATE TABLE Secretary (
    Secretary_ID VARCHAR(50) PRIMARY KEY,
    Full_Name VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone_No VARCHAR(20) NOT NULL,
    NIC VARCHAR(20),
    DOB DATE,
    Address TEXT,
    RegionalDivision VARCHAR(100),
    Status ENUM('Active', 'Inactive') DEFAULT 'Active',
    Area_ID VARCHAR(50),
    FOREIGN KEY (Area_ID) REFERENCES Area(Area_ID),
    FOREIGN KEY (Email) REFERENCES EmailRegistry(Email)
);

DELIMITER //

CREATE TRIGGER before_secretary_insert
BEFORE INSERT ON Secretary
FOR EACH ROW
BEGIN
    DECLARE email_count INT;

    -- Check if email already exists in EmailRegistry
    SELECT COUNT(*) INTO email_count
    FROM EmailRegistry
    WHERE Email = NEW.Email;

    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already in use by another user';
    END IF;

    -- Insert email into EmailRegistry
    INSERT INTO EmailRegistry (Email, UserType, UserID)
    VALUES (NEW.Email, 'Secretary', NEW.Secretary_ID);
END //
DROP TRIGGER IF EXISTS before_secretary_insert;

DELIMITER //

CREATE TRIGGER before_secretary_insert
BEFORE INSERT ON Secretary
FOR EACH ROW
BEGIN
    DECLARE email_count INT;
    SELECT COUNT(*) INTO email_count
    FROM EmailRegistry
    WHERE Email = NEW.Email;
    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already in use by another user';
    END IF;
    INSERT INTO EmailRegistry (Email, UserType, UserID)
    VALUES (NEW.Email, 'Secretary', NEW.Secretary_ID);
END //

DELIMITER ;
DROP TRIGGER IF EXISTS before_secretary_insert;
SHOW TRIGGERS WHERE `Table` = 'Secretary';
DROP TRIGGER IF EXISTS before_villager_officer_insert;
DELIMITER //

CREATE TRIGGER before_villager_officer_insert
BEFORE INSERT ON Villager_Officer
FOR EACH ROW
BEGIN
    DECLARE email_count INT;
    SELECT COUNT(*) INTO email_count
    FROM EmailRegistry
    WHERE Email = NEW.Email;
    IF email_count > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Email already in use by another user';
    END IF;
    INSERT INTO EmailRegistry (Email, UserType, UserID)
    VALUES (NEW.Email, 'Villager_Officer', NEW.Villager_Officer_ID);
END //

DELIMITER ;