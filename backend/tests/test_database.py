import pytest
from database import create_database, drop_database


@pytest.fixture(scope="module", autouse=True)
def setup_database():
    drop_database()
    create_database()


def test_database_creation(setup_database):
    assert True
