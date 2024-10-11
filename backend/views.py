from fastapi import APIRouter

router = APIRouter()


@router.get("/items/")
def get_items():
    return [{"item": "Item 1"}, {"item": "Item 2"}]
