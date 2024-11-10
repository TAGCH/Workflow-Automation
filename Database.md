# Database Installation and Visualization Guide

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- [XAMPP](https://www.apachefriends.org/index.html) (which includes MySQL)
- A compatible IDE or text editor

## Installing the Database

1. **Start XAMPP:**
   - Open the XAMPP Control Panel.
   - Start the **Apache** and **MySQL** services by clicking on the "Start" buttons next to each.

2. **Create the Database:**
   - Open your web browser and go to `http://localhost/phpmyadmin`.
   - Click on the **Databases** tab at the top.
   - In the "Create database" field, enter `workflows` and click **Create**.

3. **Run Database Migrations:**
   - Ensure you have set the `DATABASE_URL` in your `.env` file correctly as follows (or any port that you use to run MySQL):
     ```
     DATABASE_URL=mysql+pymysql://root:@127.0.0.1:3306/workflows
     ```
      **NOTED** : If the non-alembic ```database.db``` exist, then deletes that file before making initial migration.


   - Make migration according to latest model update.

      ```
      cd backend
      alembic revision --autogenerate -m "migration message"
      ```
      **NOTED** : do this step first if the file is not up to date. 

   - migrate the data

      ```
      alembic upgrade head
      ```

      This command will creates all the tables according to your SQLAlchemy models.

## Visualizing the Database

1. **Access phpMyAdmin:**
   - Open your web browser and go to `http://localhost/phpmyadmin`.
   - Log in using your MySQL credentials (default username is `root`, and the password is empty).

2. **Select the Database:**
   - On the left sidebar, you should see the `workflows` database. Click on it to select it.
   - You can now see all the tables created for your project.

## Database Structure Overview

### Tables in the `workflows` Database

1. **users**
   - **id**: Integer, primary key, unique identifier for each user.
   - **email**: String, unique email address for the user.
   - **hashed_password**: String, hashed password for user authentication.

2. **workflows**
   - **id**: Integer, primary key, unique identifier for each workflow.
   - **name**: String, name of the workflow.
   - **type**: String, type of workflow (e.g., 'gmail' or 'google_sheet').
   - **owner_id**: Integer, foreign key referencing the `users` table (the user that created the workflow).
   - **sender_email**: String, email address used to send emails.
   - **sender_hashed_password**: String, hashed password for the sender's email account.
   - **trigger_time**: Time, scheduled time to trigger the workflow.
   - **trigger_frequency**: String, frequency of the workflow trigger (e.g., 'daily', 'weekly', 'monthly').
   - **trigger_day**: String, specific day for the trigger (e.g., 'Monday' or '15' for the day of the month).
   - **status**: Boolean, indicates whether the workflow is currently stopped (False) or started (True).

3. **workflows_imports_data**
   - **id**: Integer, primary key, unique identifier for imported data records.
   - **data**: JSON, stores imported data as a dictionary.
   - **workflow_id**: Integer, foreign key referencing the `workflows` table (associated workflow).

4. **email_logs_table**
   - **id**: Integer, primary key, unique identifier for email log entries.
   - **workflow_id**: Integer, foreign key referencing the `workflows` table (associated workflow).
   - **sent_at**: DateTime, timestamp of when the email was sent.
   - **recipient_email**: String, email address of the recipient.
   - **status**: String, status of the email (e.g., 'sent', 'failed', etc.).
   - **error_message**: String, optional error message if the email sending failed.

5. **gmailflow**
   - **id**: Integer, primary key, unique identifier for each Gmail-specific workflow.
   - **email**: String, email address of the recipient.
   - **title**: String, subject line for the email.
   - **body**: String, body content of the email.
   - **name**: String, descriptive name for the Gmail flow.
   - **workflow_id**: Integer, foreign key referencing the `workflows` table, linking this flow to a specific workflow.
   - **workflow**: Relationship, establishes a back-reference to the associated `Workflow` object, enabling bi-directional association.

## Conclusion

You have now set up your MySQL database using XAMPP and can visualize it via phpMyAdmin. You can manage your database tables and entries easily from the phpMyAdmin interface.
