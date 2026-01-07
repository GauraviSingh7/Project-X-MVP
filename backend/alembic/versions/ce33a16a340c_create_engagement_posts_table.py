"""create_engagement_posts_table

Revision ID: ce33a16a340c
Revises: a906d6d1b33b
Create Date: 2026-01-07 08:49:08.365363

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ce33a16a340c'
down_revision: Union[str, Sequence[str], None] = 'a906d6d1b33b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'engagement_posts',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('source', sa.String(), nullable=False),
        sa.Column('source_id', sa.String(), nullable=False),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('text', sa.Text(), nullable=True),
        sa.Column('url', sa.String(), nullable=False),
        sa.Column('media', sa.JSON(), nullable=True),
        sa.Column('author', sa.JSON(), nullable=True),
        sa.Column('metrics', sa.JSON(), nullable=True),
        sa.Column('published_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('fetched_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_engagement_posts_source'), 'engagement_posts', ['source'], unique=False)
    op.create_index(op.f('ix_engagement_posts_source_id'), 'engagement_posts', ['source_id'], unique=False)
    op.create_index(op.f('ix_engagement_posts_published_at'), 'engagement_posts', ['published_at'], unique=False)

def downgrade() -> None:
    op.drop_index(op.f('ix_engagement_posts_published_at'), table_name='engagement_posts')
    op.drop_index(op.f('ix_engagement_posts_source_id'), table_name='engagement_posts')
    op.drop_index(op.f('ix_engagement_posts_source'), table_name='engagement_posts')
    op.drop_table('engagement_posts')