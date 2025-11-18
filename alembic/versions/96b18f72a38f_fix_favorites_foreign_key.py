"""Fix favorites foreign key

Revision ID: 96b18f72a38f
Revises: 4a7afaff2e5c
Create Date: 2025-11-18 17:07:42.511174

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '96b18f72a38f'
down_revision: Union[str, Sequence[str], None] = '4a7afaff2e5c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Drop old wrong FK
    op.drop_constraint(
        constraint_name="favorites_recipe_id_fkey",
        table_name="favorites",
        type_="foreignkey"
    )

    # Create correct FK
    op.create_foreign_key(
        constraint_name="favorites_recipe_id_fkey",
        source_table="favorites",
        referent_table="recipes",
        local_cols=["recipe_id"],
        remote_cols=["id"],
        ondelete="CASCADE"
    )



def downgrade():
    pass
