"""workflow-sending-email migration

Revision ID: e6d58c1f902c
Revises: fb7e9f02ce1a
Create Date: 2024-11-09 14:06:39.552106

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa



# revision identifiers, used by Alembic.
revision: str = 'e6d58c1f902c'
down_revision: Union[str, None] = 'fb7e9f02ce1a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('workflows_imports_data', sa.Column('filename', sa.String(length=265), nullable=False))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('workflows_imports_data', 'filename')
    # ### end Alembic commands ###
