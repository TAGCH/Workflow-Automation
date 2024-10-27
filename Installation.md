# Installation steps

## 1. Clone repository

- Clone this repository to your local computer.

```
git clone https://github.com/TAGCH/Workflow-Automation.git DirectoryName
```
**NOTED**: ```DirectoryName``` is your desired directory name.

## 2. Create virtual environment and install dependencies

- Create virtual environment.

```
python -m venv env
```

- Change to your newly created virtual environment.

For Mac and Linux.
```
source env/bin/activate
```
For Window.
```
env\Scripts\activate.bat
```

- Install packages from requirements.txt

```
pip install -r requirements.txt
```

## 3. Set values for externalized variables
- Create file `.env` to configuration and get the secret key [Secret Key](https://djecrety.ir)

- Copy code from [sample.env](sample.env) and paste it in `.env`

- Set `JWT_SECRET=Secret_Key`

## 4. Run tests for backend.

- Set the PYTHONPATH Environment Variable.

```
cd backend
set PYTHONPATH=project_path
```


- Checking all tests.

```
pytest
```