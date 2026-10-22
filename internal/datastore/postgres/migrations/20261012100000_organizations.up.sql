CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    plan_name VARCHAR NOT NULL DEFAULT 'free',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Unique among live rows only, so a soft-deleted name can be reused.
CREATE UNIQUE INDEX idx_organizations_name ON organizations (name) WHERE deleted_at IS NULL;
CREATE INDEX idx_organizations_deleted_at ON organizations (deleted_at);
