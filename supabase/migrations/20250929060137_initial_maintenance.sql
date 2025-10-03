create type "public"."invitation_status" as enum ('accepted', 'pending', 'declined');

create table "public"."asset" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "asset_group_id" uuid not null default gen_random_uuid(),
    "metadata" json not null default '{}'::json,
    "url" text not null default ''::text,
    "created_by_id" uuid not null default gen_random_uuid(),
    "name" text not null,
    "content_type" text,
    "size" numeric not null default '0'::numeric,
    "original_file_name" text not null,
    "is_archived" boolean not null default false,
    "updated_by_id" uuid
);


create table "public"."asset_group" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "project_id" uuid not null default gen_random_uuid(),
    "parent_id" uuid,
    "type" text,
    "created_by_id" uuid not null,
    "snapshot" text,
    "is_archived" boolean not null default false,
    "updated_by_id" uuid,
    "size" numeric default '0'::numeric,
    "file_count" numeric
);


create table "public"."asset_group_member" (
    "project_member_id" uuid not null default gen_random_uuid(),
    "asset_group_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "allow_full_view" boolean not null default false,
    "id" uuid not null default gen_random_uuid(),
    "role_id" uuid not null default gen_random_uuid()
);


create table "public"."asset_member" (
    "id" uuid not null default gen_random_uuid(),
    "asset_id" uuid not null default gen_random_uuid(),
    "asset_group_member_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "role_id" uuid not null default gen_random_uuid()
);


create table "public"."handle" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid default gen_random_uuid(),
    "organization_id" uuid default gen_random_uuid(),
    "name" text not null
);


create table "public"."organization" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "primary_owner_id" uuid not null default gen_random_uuid(),
    "is_mfa_required" boolean not null default false,
    "metadata" json default '{}'::json
);


create table "public"."organization_member" (
    "organization_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "role_id" uuid not null default gen_random_uuid(),
    "invitation_status" invitation_status,
    "id" uuid not null default gen_random_uuid(),
    "join_date" timestamp with time zone not null default now()
);


create table "public"."organization_role" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone default now(),
    "name" text,
    "permissions" json not null default '{}'::json,
    "organization_id" uuid default gen_random_uuid(),
    "description" text
);


create table "public"."project" (
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "is_archived" boolean not null default false,
    "photo_url" text,
    "starred" json,
    "primary_owner_id" uuid not null default gen_random_uuid(),
    "workspace_id" uuid not null,
    "file_count" numeric default '0'::numeric,
    "id" uuid not null default gen_random_uuid(),
    "name" text,
    "updated_by_id" uuid,
    "size" numeric default '0'::numeric
);


create table "public"."project_member" (
    "id" uuid not null default gen_random_uuid(),
    "workspace_member_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "project_id" uuid not null default gen_random_uuid(),
    "allow_full_view" boolean not null default false,
    "role_id" uuid not null default gen_random_uuid()
);


create table "public"."user_settings" (
    "user_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "default_organization_id" uuid not null,
    "default_workspace_id" uuid not null default gen_random_uuid()
);


create table "public"."workspace" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "name" text not null,
    "organization_id" uuid default gen_random_uuid(),
    "metadata" json default '{}'::json,
    "size" numeric default '0'::numeric
);


create table "public"."workspace_member" (
    "workspace_id" uuid not null default gen_random_uuid(),
    "organization_member_id" uuid not null default gen_random_uuid(),
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "role_id" uuid not null default gen_random_uuid()
);


CREATE UNIQUE INDEX asset_group_member_pkey ON public.asset_group_member USING btree (id);

CREATE UNIQUE INDEX asset_group_pkey ON public.asset_group USING btree (id);

CREATE UNIQUE INDEX asset_member_pkey ON public.asset_member USING btree (id);

CREATE UNIQUE INDEX asset_pkey ON public.asset USING btree (id);

CREATE UNIQUE INDEX handle_name_key ON public.handle USING btree (name);

CREATE UNIQUE INDEX handle_pkey ON public.handle USING btree (id);

CREATE UNIQUE INDEX organization_member_pkey ON public.organization_member USING btree (id);

CREATE UNIQUE INDEX organization_pkey ON public.organization USING btree (id);

CREATE UNIQUE INDEX organization_role_pkey ON public.organization_role USING btree (id);

CREATE UNIQUE INDEX project_member_pkey ON public.project_member USING btree (id);

CREATE UNIQUE INDEX project_pkey ON public.project USING btree (id);

CREATE UNIQUE INDEX user_settings_pkey ON public.user_settings USING btree (user_id);

CREATE UNIQUE INDEX workspace_member_pkey ON public.workspace_member USING btree (id);

CREATE UNIQUE INDEX workspace_pkey ON public.workspace USING btree (id);

alter table "public"."asset" add constraint "asset_pkey" PRIMARY KEY using index "asset_pkey";

alter table "public"."asset_group" add constraint "asset_group_pkey" PRIMARY KEY using index "asset_group_pkey";

alter table "public"."asset_group_member" add constraint "asset_group_member_pkey" PRIMARY KEY using index "asset_group_member_pkey";

alter table "public"."asset_member" add constraint "asset_member_pkey" PRIMARY KEY using index "asset_member_pkey";

alter table "public"."handle" add constraint "handle_pkey" PRIMARY KEY using index "handle_pkey";

alter table "public"."organization" add constraint "organization_pkey" PRIMARY KEY using index "organization_pkey";

alter table "public"."organization_member" add constraint "organization_member_pkey" PRIMARY KEY using index "organization_member_pkey";

alter table "public"."organization_role" add constraint "organization_role_pkey" PRIMARY KEY using index "organization_role_pkey";

alter table "public"."project" add constraint "project_pkey" PRIMARY KEY using index "project_pkey";

alter table "public"."project_member" add constraint "project_member_pkey" PRIMARY KEY using index "project_member_pkey";

alter table "public"."user_settings" add constraint "user_settings_pkey" PRIMARY KEY using index "user_settings_pkey";

alter table "public"."workspace" add constraint "workspace_pkey" PRIMARY KEY using index "workspace_pkey";

alter table "public"."workspace_member" add constraint "workspace_member_pkey" PRIMARY KEY using index "workspace_member_pkey";

alter table "public"."asset" add constraint "asset_asset_group_id_fkey" FOREIGN KEY (asset_group_id) REFERENCES asset_group(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset" validate constraint "asset_asset_group_id_fkey";

alter table "public"."asset" add constraint "asset_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset" validate constraint "asset_created_by_id_fkey";

alter table "public"."asset" add constraint "asset_updated_by_id_fkey" FOREIGN KEY (updated_by_id) REFERENCES auth.users(id) not valid;

alter table "public"."asset" validate constraint "asset_updated_by_id_fkey";

alter table "public"."asset_group" add constraint "asset_group_created_by_id_fkey" FOREIGN KEY (created_by_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_group" validate constraint "asset_group_created_by_id_fkey";

alter table "public"."asset_group" add constraint "asset_group_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES asset_group(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_group" validate constraint "asset_group_parent_id_fkey";

alter table "public"."asset_group" add constraint "asset_group_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_group" validate constraint "asset_group_project_id_fkey";

alter table "public"."asset_group" add constraint "asset_group_updated_by_id_fkey" FOREIGN KEY (updated_by_id) REFERENCES auth.users(id) not valid;

alter table "public"."asset_group" validate constraint "asset_group_updated_by_id_fkey";

alter table "public"."asset_group_member" add constraint "asset_group_member_asset_group_id_fkey" FOREIGN KEY (asset_group_id) REFERENCES asset_group(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_group_member" validate constraint "asset_group_member_asset_group_id_fkey";

alter table "public"."asset_group_member" add constraint "asset_group_member_project_member_id_fkey" FOREIGN KEY (project_member_id) REFERENCES project_member(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_group_member" validate constraint "asset_group_member_project_member_id_fkey";

alter table "public"."asset_group_member" add constraint "asset_group_member_role_id_fkey" FOREIGN KEY (role_id) REFERENCES organization_role(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_group_member" validate constraint "asset_group_member_role_id_fkey";

alter table "public"."asset_group_member" add constraint "asset_group_member_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_group_member" validate constraint "asset_group_member_user_id_fkey";

alter table "public"."asset_member" add constraint "asset_member_asset_group_member_id_fkey" FOREIGN KEY (asset_group_member_id) REFERENCES asset_group_member(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_member" validate constraint "asset_member_asset_group_member_id_fkey";

alter table "public"."asset_member" add constraint "asset_member_asset_id_fkey" FOREIGN KEY (asset_id) REFERENCES asset(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_member" validate constraint "asset_member_asset_id_fkey";

alter table "public"."asset_member" add constraint "asset_member_role_id_fkey" FOREIGN KEY (role_id) REFERENCES organization_role(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_member" validate constraint "asset_member_role_id_fkey";

alter table "public"."asset_member" add constraint "asset_member_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."asset_member" validate constraint "asset_member_user_id_fkey";

alter table "public"."handle" add constraint "handle_name_key" UNIQUE using index "handle_name_key";

alter table "public"."handle" add constraint "handle_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organization(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."handle" validate constraint "handle_organization_id_fkey";

alter table "public"."handle" add constraint "handle_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."handle" validate constraint "handle_user_id_fkey";

alter table "public"."organization" add constraint "organization_primary_owner_id_fkey" FOREIGN KEY (primary_owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization" validate constraint "organization_primary_owner_id_fkey";

alter table "public"."organization_member" add constraint "organization_member_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organization(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_member" validate constraint "organization_member_organization_id_fkey";

alter table "public"."organization_member" add constraint "organization_member_role_id_fkey" FOREIGN KEY (role_id) REFERENCES organization_role(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_member" validate constraint "organization_member_role_id_fkey";

alter table "public"."organization_member" add constraint "organization_member_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_member" validate constraint "organization_member_user_id_fkey";

alter table "public"."organization_role" add constraint "organization_role_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organization(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."organization_role" validate constraint "organization_role_organization_id_fkey";

alter table "public"."project" add constraint "project_primary_owner_id_fkey" FOREIGN KEY (primary_owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project" validate constraint "project_primary_owner_id_fkey";

alter table "public"."project" add constraint "project_updated_by_id_fkey" FOREIGN KEY (updated_by_id) REFERENCES auth.users(id) not valid;

alter table "public"."project" validate constraint "project_updated_by_id_fkey";

alter table "public"."project" add constraint "project_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project" validate constraint "project_workspace_id_fkey";

alter table "public"."project_member" add constraint "project_member_project_id_fkey" FOREIGN KEY (project_id) REFERENCES project(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_member" validate constraint "project_member_project_id_fkey";

alter table "public"."project_member" add constraint "project_member_role_id_fkey" FOREIGN KEY (role_id) REFERENCES organization_role(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_member" validate constraint "project_member_role_id_fkey";

alter table "public"."project_member" add constraint "project_member_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_member" validate constraint "project_member_user_id_fkey";

alter table "public"."project_member" add constraint "project_member_workspace_member_id_fkey" FOREIGN KEY (workspace_member_id) REFERENCES workspace_member(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."project_member" validate constraint "project_member_workspace_member_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_default_organization_id_fkey" FOREIGN KEY (default_organization_id) REFERENCES organization(id) not valid;

alter table "public"."user_settings" validate constraint "user_settings_default_organization_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_default_workspace_id_fkey" FOREIGN KEY (default_workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_default_workspace_id_fkey";

alter table "public"."user_settings" add constraint "user_settings_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_settings" validate constraint "user_settings_user_id_fkey";

alter table "public"."workspace" add constraint "workspace_organization_id_fkey" FOREIGN KEY (organization_id) REFERENCES organization(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace" validate constraint "workspace_organization_id_fkey";

alter table "public"."workspace_member" add constraint "workspace_member_organization_member_id_fkey" FOREIGN KEY (organization_member_id) REFERENCES organization_member(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "workspace_member_organization_member_id_fkey";

alter table "public"."workspace_member" add constraint "workspace_member_role_id_fkey" FOREIGN KEY (role_id) REFERENCES organization_role(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "workspace_member_role_id_fkey";

alter table "public"."workspace_member" add constraint "workspace_member_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "workspace_member_user_id_fkey";

alter table "public"."workspace_member" add constraint "workspace_member_workspace_id_fkey" FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."workspace_member" validate constraint "workspace_member_workspace_id_fkey";

set check_function_bodies = off;

create or replace view "public"."archived_asset_group_with_asset_by_workspace" as  SELECT ag.id AS asset_group_id,
    ag.created_at AS asset_group_created_at,
    ag.updated_at AS asset_group_updated_at,
    ag.name AS asset_group_name,
    ag.project_id,
    p.workspace_id,
    ag.parent_id,
    ag.created_by_id AS asset_group_created_by_id,
    ag.snapshot,
    ag.is_archived AS asset_group_is_archived,
    NULL::uuid AS asset_id,
    NULL::timestamp with time zone AS asset_created_at,
    NULL::timestamp with time zone AS asset_updated_at,
    NULL::json AS metadata,
    NULL::text AS url,
    NULL::uuid AS asset_created_by_id,
    NULL::text AS asset_name,
    NULL::text AS content_type,
    NULL::numeric AS size,
    NULL::text AS original_file_name,
    NULL::boolean AS asset_is_archived
   FROM (asset_group ag
     JOIN project p ON ((ag.project_id = p.id)))
UNION ALL
 SELECT a.asset_group_id,
    NULL::timestamp with time zone AS asset_group_created_at,
    NULL::timestamp with time zone AS asset_group_updated_at,
    NULL::text AS asset_group_name,
    ag.project_id,
    p.workspace_id,
    NULL::uuid AS parent_id,
    NULL::uuid AS asset_group_created_by_id,
    NULL::text AS snapshot,
    NULL::boolean AS asset_group_is_archived,
    a.id AS asset_id,
    a.created_at AS asset_created_at,
    a.updated_at AS asset_updated_at,
    a.metadata,
    a.url,
    a.created_by_id AS asset_created_by_id,
    a.name AS asset_name,
    a.content_type,
    a.size,
    a.original_file_name,
    a.is_archived AS asset_is_archived
   FROM ((asset a
     LEFT JOIN asset_group ag ON ((a.asset_group_id = ag.id)))
     LEFT JOIN project p ON ((ag.project_id = p.id)))
UNION ALL
 SELECT NULL::uuid AS asset_group_id,
    NULL::timestamp with time zone AS asset_group_created_at,
    NULL::timestamp with time zone AS asset_group_updated_at,
    p.name AS asset_group_name,
    p.id AS project_id,
    p.workspace_id,
    NULL::uuid AS parent_id,
    NULL::uuid AS asset_group_created_by_id,
    NULL::text AS snapshot,
    p.is_archived AS asset_group_is_archived,
    NULL::uuid AS asset_id,
    NULL::timestamp with time zone AS asset_created_at,
    NULL::timestamp with time zone AS asset_updated_at,
    NULL::json AS metadata,
    NULL::text AS url,
    NULL::uuid AS asset_created_by_id,
    NULL::text AS asset_name,
    NULL::text AS content_type,
    NULL::numeric AS size,
    NULL::text AS original_file_name,
    NULL::boolean AS asset_is_archived
   FROM project p
  WHERE (p.is_archived IS TRUE);


create or replace view "public"."asset_group_with_asset" as  SELECT ag.id AS asset_group_id,
    ag.created_at AS asset_group_created_at,
    ag.updated_at AS asset_group_updated_at,
    ag.name AS asset_group_name,
    ag.project_id,
    ag.parent_id,
    ag.type AS asset_group_type,
    ag.created_by_id AS asset_group_created_by_id,
    ag.snapshot,
    ag.is_archived AS asset_group_is_archived,
    ag.updated_by_id AS asset_group_updated_by_id,
    NULL::uuid AS asset_id,
    NULL::timestamp with time zone AS asset_created_at,
    NULL::timestamp with time zone AS asset_updated_at,
    NULL::json AS metadata,
    NULL::text AS url,
    NULL::uuid AS asset_created_by_id,
    NULL::text AS asset_name,
    NULL::text AS content_type,
    NULL::numeric AS size,
    NULL::text AS original_file_name,
    NULL::boolean AS asset_is_archived,
    NULL::uuid AS asset_updated_by_id
   FROM asset_group ag
UNION ALL
 SELECT a.asset_group_id,
    NULL::timestamp with time zone AS asset_group_created_at,
    NULL::timestamp with time zone AS asset_group_updated_at,
    NULL::text AS asset_group_name,
    NULL::uuid AS project_id,
    NULL::uuid AS parent_id,
    NULL::text AS asset_group_type,
    NULL::uuid AS asset_group_created_by_id,
    NULL::text AS snapshot,
    NULL::boolean AS asset_group_is_archived,
    NULL::uuid AS asset_group_updated_by_id,
    a.id AS asset_id,
    a.created_at AS asset_created_at,
    a.updated_at AS asset_updated_at,
    a.metadata,
    a.url,
    a.created_by_id AS asset_created_by_id,
    a.name AS asset_name,
    a.content_type,
    a.size,
    a.original_file_name,
    a.is_archived AS asset_is_archived,
    a.updated_by_id AS asset_updated_by_id
   FROM asset a;


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  new_org_id uuid;
  new_ws_id uuid;
  admin_role_id uuid;
  new_organization_member_id uuid;
begin
  -- Step 1: Create a new organization for the user
  insert into public.organization (id, name, primary_owner_id, created_at, updated_at, is_mfa_required, metadata)
  values (
    gen_random_uuid(),
    'Default Organization',
    new.id,
    now(),
    now(),
    false,
    '{}'::json
  )
  returning id into new_org_id;

  -- Step 2: Create a new workspace for the organization
  insert into public.workspace (id, name, organization_id, created_at, updated_at, metadata)
  values (
    gen_random_uuid(),
    'Default Workspace',
    new_org_id,
    now(),
    now(),
    '{}'::json
  )
  returning id into new_ws_id;

  -- Step 3: Create user_settings entry with default org and workspace
  insert into public.user_settings (user_id, created_at, updated_at, default_organization_id, default_workspace_id)
  values (
    new.id,
    now(),
    now(),
    new_org_id,
    new_ws_id
  );

  -- Insert Administrator role
  INSERT INTO public.organization_role (organization_id, name, description, permissions)
  VALUES (
    new_org_id,
    'Administrator',
    'Full control over system settings, content, user management, and account subscriptions.',
    '{
      "full_workspace_view": true,
      "view_only_assigned": false,
      "comment_on_files": true,
      "edit_files": true,
      "create_files_and_folders": true,
      "manage_project_members": true,
      "restore_archived_files": true,
      "create_projects": true,
      "move_files_within_project": true,
      "move_files_between_projects": true,
      "change_member_access": true,
      "permanently_delete_files": true,
      "share_project_data": true,
      "archive_or_delete_projects": true,
      "manage_account_settings": true
    }'::jsonb
  )
  returning id into admin_role_id;

  -- Insert Project Manager role
  INSERT INTO public.organization_role (organization_id, name, description, permissions)
  VALUES (
    new_org_id,
    'Project Manager',
    'Manages, organizes, edits, and deletes content but has no control over account settings or user management.',
    '{
      "full_workspace_view": true,
      "view_only_assigned": false,
      "comment_on_files": true,
      "edit_files": true,
      "create_files_and_folders": true,
      "manage_project_members": true,
      "restore_archived_files": true,
      "create_projects": true,
      "move_files_within_project": true,
      "move_files_between_projects": true,
      "change_member_access": true,
      "permanently_delete_files": true,
      "share_project_data": true,
      "archive_or_delete_projects": true,
      "manage_account_settings": false
    }'::jsonb
  );

  -- Insert Supervisor role
  INSERT INTO public.organization_role (organization_id, name, description, permissions)
  VALUES (
    new_org_id,
    'Supervisor',
    'Reviews and comments on content but cannot edit or create files.',
    '{
      "full_workspace_view": true,
      "view_only_assigned": false,
      "comment_on_files": true,
      "edit_files": true,
      "create_files_and_folders": true,
      "manage_project_members": true,
      "restore_archived_files": true,
      "create_projects": true,
      "move_files_within_project": true,
      "move_files_between_projects": false,
      "change_member_access": false,
      "permanently_delete_files": false,
      "share_project_data": true,
      "archive_or_delete_projects": true,
      "manage_account_settings": false
    }'::jsonb
  );

  -- Insert Contributor role
  INSERT INTO public.organization_role (organization_id, name, description, permissions)
  VALUES (
    new_org_id,
    'Contributor',
    'Can create, edit, and comment on content but cannot permanently delete files or manage users.',
    '{
      "full_workspace_view": false,
      "view_only_assigned": true,
      "comment_on_files": true,
      "edit_files": true,
      "create_files_and_folders": true,
      "manage_project_members": false,
      "restore_archived_files": false,
      "create_projects": false,
      "move_files_within_project": false,
      "move_files_between_projects": false,
      "change_member_access": false,
      "permanently_delete_files": false,
      "share_project_data": false,
      "archive_or_delete_projects": false,
      "manage_account_settings": false
    }'::jsonb
  );

  -- Insert Viewer role
  INSERT INTO public.organization_role (organization_id, name, description, permissions)
  VALUES (
    new_org_id,
    'Viewer',
    'Read-only access to view content with no editing or commenting privileges.',
    '{
      "full_workspace_view": false,
      "view_only_assigned": true,
      "comment_on_files": true,
      "edit_files": false,
      "create_files_and_folders": false,
      "manage_project_members": false,
      "restore_archived_files": false,
      "create_projects": false,
      "move_files_within_project": false,
      "move_files_between_projects": false,
      "change_member_access": false,
      "permanently_delete_files": false,
      "share_project_data": false,
      "archive_or_delete_projects": false,
      "manage_account_settings": false
    }'::jsonb
  );

  insert into public.organization_member (id, organization_id, user_id, role_id)
  values (
    gen_random_uuid(),
    new_org_id,
    new.id,
    admin_role_id
  )
  returning id into new_organization_member_id;

  insert into public.workspace_member (id, workspace_id, organization_member_id, user_id, role_id)
  values (
    gen_random_uuid(),
    new_ws_id,
    new_organization_member_id,
    new.id,
    admin_role_id
  );

  return new;
end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_project_insert()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$BEGIN
  insert into public.asset_group (id, created_at, updated_at, name, project_id, parent_id, type, created_by_id)
  values (
    gen_random_uuid(),
    now(),
    now(),
    '',
    new.id,
    null,
    '',
    new.primary_owner_id
  );

  return new;
END;$function$
;

CREATE OR REPLACE FUNCTION public.update_asset_group_size_and_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE asset_group
    SET
        size = (SELECT SUM(size) FROM asset WHERE asset_group_id = NEW.asset_group_id),
        file_count = (SELECT COUNT(*) FROM asset WHERE asset_group_id = NEW.asset_group_id)
    WHERE id = NEW.asset_group_id;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_project_size_and_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE project
    SET
        size = (SELECT SUM(size) FROM asset_group WHERE project_id = NEW.project_id),
        file_count = (SELECT SUM(file_count) FROM asset_group WHERE project_id = NEW.project_id)
    WHERE id = NEW.project_id;

    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_workspace_size()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE workspace
    SET
        size = (SELECT SUM(size) FROM project WHERE workspace_id = NEW.workspace_id)
    WHERE id = NEW.workspace_id;

    RETURN NEW;
END;
$function$
;

create or replace view "public"."user" as  SELECT id,
    email,
    raw_user_meta_data AS metadata,
    created_at,
    last_sign_in_at
   FROM auth.users;


grant delete on table "public"."asset" to "anon";

grant insert on table "public"."asset" to "anon";

grant references on table "public"."asset" to "anon";

grant select on table "public"."asset" to "anon";

grant trigger on table "public"."asset" to "anon";

grant truncate on table "public"."asset" to "anon";

grant update on table "public"."asset" to "anon";

grant delete on table "public"."asset" to "authenticated";

grant insert on table "public"."asset" to "authenticated";

grant references on table "public"."asset" to "authenticated";

grant select on table "public"."asset" to "authenticated";

grant trigger on table "public"."asset" to "authenticated";

grant truncate on table "public"."asset" to "authenticated";

grant update on table "public"."asset" to "authenticated";

grant delete on table "public"."asset" to "service_role";

grant insert on table "public"."asset" to "service_role";

grant references on table "public"."asset" to "service_role";

grant select on table "public"."asset" to "service_role";

grant trigger on table "public"."asset" to "service_role";

grant truncate on table "public"."asset" to "service_role";

grant update on table "public"."asset" to "service_role";

grant delete on table "public"."asset_group" to "anon";

grant insert on table "public"."asset_group" to "anon";

grant references on table "public"."asset_group" to "anon";

grant select on table "public"."asset_group" to "anon";

grant trigger on table "public"."asset_group" to "anon";

grant truncate on table "public"."asset_group" to "anon";

grant update on table "public"."asset_group" to "anon";

grant delete on table "public"."asset_group" to "authenticated";

grant insert on table "public"."asset_group" to "authenticated";

grant references on table "public"."asset_group" to "authenticated";

grant select on table "public"."asset_group" to "authenticated";

grant trigger on table "public"."asset_group" to "authenticated";

grant truncate on table "public"."asset_group" to "authenticated";

grant update on table "public"."asset_group" to "authenticated";

grant delete on table "public"."asset_group" to "service_role";

grant insert on table "public"."asset_group" to "service_role";

grant references on table "public"."asset_group" to "service_role";

grant select on table "public"."asset_group" to "service_role";

grant trigger on table "public"."asset_group" to "service_role";

grant truncate on table "public"."asset_group" to "service_role";

grant update on table "public"."asset_group" to "service_role";

grant delete on table "public"."asset_group_member" to "anon";

grant insert on table "public"."asset_group_member" to "anon";

grant references on table "public"."asset_group_member" to "anon";

grant select on table "public"."asset_group_member" to "anon";

grant trigger on table "public"."asset_group_member" to "anon";

grant truncate on table "public"."asset_group_member" to "anon";

grant update on table "public"."asset_group_member" to "anon";

grant delete on table "public"."asset_group_member" to "authenticated";

grant insert on table "public"."asset_group_member" to "authenticated";

grant references on table "public"."asset_group_member" to "authenticated";

grant select on table "public"."asset_group_member" to "authenticated";

grant trigger on table "public"."asset_group_member" to "authenticated";

grant truncate on table "public"."asset_group_member" to "authenticated";

grant update on table "public"."asset_group_member" to "authenticated";

grant delete on table "public"."asset_group_member" to "service_role";

grant insert on table "public"."asset_group_member" to "service_role";

grant references on table "public"."asset_group_member" to "service_role";

grant select on table "public"."asset_group_member" to "service_role";

grant trigger on table "public"."asset_group_member" to "service_role";

grant truncate on table "public"."asset_group_member" to "service_role";

grant update on table "public"."asset_group_member" to "service_role";

grant delete on table "public"."asset_member" to "anon";

grant insert on table "public"."asset_member" to "anon";

grant references on table "public"."asset_member" to "anon";

grant select on table "public"."asset_member" to "anon";

grant trigger on table "public"."asset_member" to "anon";

grant truncate on table "public"."asset_member" to "anon";

grant update on table "public"."asset_member" to "anon";

grant delete on table "public"."asset_member" to "authenticated";

grant insert on table "public"."asset_member" to "authenticated";

grant references on table "public"."asset_member" to "authenticated";

grant select on table "public"."asset_member" to "authenticated";

grant trigger on table "public"."asset_member" to "authenticated";

grant truncate on table "public"."asset_member" to "authenticated";

grant update on table "public"."asset_member" to "authenticated";

grant delete on table "public"."asset_member" to "service_role";

grant insert on table "public"."asset_member" to "service_role";

grant references on table "public"."asset_member" to "service_role";

grant select on table "public"."asset_member" to "service_role";

grant trigger on table "public"."asset_member" to "service_role";

grant truncate on table "public"."asset_member" to "service_role";

grant update on table "public"."asset_member" to "service_role";

grant delete on table "public"."handle" to "anon";

grant insert on table "public"."handle" to "anon";

grant references on table "public"."handle" to "anon";

grant select on table "public"."handle" to "anon";

grant trigger on table "public"."handle" to "anon";

grant truncate on table "public"."handle" to "anon";

grant update on table "public"."handle" to "anon";

grant delete on table "public"."handle" to "authenticated";

grant insert on table "public"."handle" to "authenticated";

grant references on table "public"."handle" to "authenticated";

grant select on table "public"."handle" to "authenticated";

grant trigger on table "public"."handle" to "authenticated";

grant truncate on table "public"."handle" to "authenticated";

grant update on table "public"."handle" to "authenticated";

grant delete on table "public"."handle" to "service_role";

grant insert on table "public"."handle" to "service_role";

grant references on table "public"."handle" to "service_role";

grant select on table "public"."handle" to "service_role";

grant trigger on table "public"."handle" to "service_role";

grant truncate on table "public"."handle" to "service_role";

grant update on table "public"."handle" to "service_role";

grant delete on table "public"."organization" to "anon";

grant insert on table "public"."organization" to "anon";

grant references on table "public"."organization" to "anon";

grant select on table "public"."organization" to "anon";

grant trigger on table "public"."organization" to "anon";

grant truncate on table "public"."organization" to "anon";

grant update on table "public"."organization" to "anon";

grant delete on table "public"."organization" to "authenticated";

grant insert on table "public"."organization" to "authenticated";

grant references on table "public"."organization" to "authenticated";

grant select on table "public"."organization" to "authenticated";

grant trigger on table "public"."organization" to "authenticated";

grant truncate on table "public"."organization" to "authenticated";

grant update on table "public"."organization" to "authenticated";

grant delete on table "public"."organization" to "service_role";

grant insert on table "public"."organization" to "service_role";

grant references on table "public"."organization" to "service_role";

grant select on table "public"."organization" to "service_role";

grant trigger on table "public"."organization" to "service_role";

grant truncate on table "public"."organization" to "service_role";

grant update on table "public"."organization" to "service_role";

grant delete on table "public"."organization_member" to "anon";

grant insert on table "public"."organization_member" to "anon";

grant references on table "public"."organization_member" to "anon";

grant select on table "public"."organization_member" to "anon";

grant trigger on table "public"."organization_member" to "anon";

grant truncate on table "public"."organization_member" to "anon";

grant update on table "public"."organization_member" to "anon";

grant delete on table "public"."organization_member" to "authenticated";

grant insert on table "public"."organization_member" to "authenticated";

grant references on table "public"."organization_member" to "authenticated";

grant select on table "public"."organization_member" to "authenticated";

grant trigger on table "public"."organization_member" to "authenticated";

grant truncate on table "public"."organization_member" to "authenticated";

grant update on table "public"."organization_member" to "authenticated";

grant delete on table "public"."organization_member" to "service_role";

grant insert on table "public"."organization_member" to "service_role";

grant references on table "public"."organization_member" to "service_role";

grant select on table "public"."organization_member" to "service_role";

grant trigger on table "public"."organization_member" to "service_role";

grant truncate on table "public"."organization_member" to "service_role";

grant update on table "public"."organization_member" to "service_role";

grant delete on table "public"."organization_role" to "anon";

grant insert on table "public"."organization_role" to "anon";

grant references on table "public"."organization_role" to "anon";

grant select on table "public"."organization_role" to "anon";

grant trigger on table "public"."organization_role" to "anon";

grant truncate on table "public"."organization_role" to "anon";

grant update on table "public"."organization_role" to "anon";

grant delete on table "public"."organization_role" to "authenticated";

grant insert on table "public"."organization_role" to "authenticated";

grant references on table "public"."organization_role" to "authenticated";

grant select on table "public"."organization_role" to "authenticated";

grant trigger on table "public"."organization_role" to "authenticated";

grant truncate on table "public"."organization_role" to "authenticated";

grant update on table "public"."organization_role" to "authenticated";

grant delete on table "public"."organization_role" to "service_role";

grant insert on table "public"."organization_role" to "service_role";

grant references on table "public"."organization_role" to "service_role";

grant select on table "public"."organization_role" to "service_role";

grant trigger on table "public"."organization_role" to "service_role";

grant truncate on table "public"."organization_role" to "service_role";

grant update on table "public"."organization_role" to "service_role";

grant delete on table "public"."project" to "anon";

grant insert on table "public"."project" to "anon";

grant references on table "public"."project" to "anon";

grant select on table "public"."project" to "anon";

grant trigger on table "public"."project" to "anon";

grant truncate on table "public"."project" to "anon";

grant update on table "public"."project" to "anon";

grant delete on table "public"."project" to "authenticated";

grant insert on table "public"."project" to "authenticated";

grant references on table "public"."project" to "authenticated";

grant select on table "public"."project" to "authenticated";

grant trigger on table "public"."project" to "authenticated";

grant truncate on table "public"."project" to "authenticated";

grant update on table "public"."project" to "authenticated";

grant delete on table "public"."project" to "service_role";

grant insert on table "public"."project" to "service_role";

grant references on table "public"."project" to "service_role";

grant select on table "public"."project" to "service_role";

grant trigger on table "public"."project" to "service_role";

grant truncate on table "public"."project" to "service_role";

grant update on table "public"."project" to "service_role";

grant delete on table "public"."project_member" to "anon";

grant insert on table "public"."project_member" to "anon";

grant references on table "public"."project_member" to "anon";

grant select on table "public"."project_member" to "anon";

grant trigger on table "public"."project_member" to "anon";

grant truncate on table "public"."project_member" to "anon";

grant update on table "public"."project_member" to "anon";

grant delete on table "public"."project_member" to "authenticated";

grant insert on table "public"."project_member" to "authenticated";

grant references on table "public"."project_member" to "authenticated";

grant select on table "public"."project_member" to "authenticated";

grant trigger on table "public"."project_member" to "authenticated";

grant truncate on table "public"."project_member" to "authenticated";

grant update on table "public"."project_member" to "authenticated";

grant delete on table "public"."project_member" to "service_role";

grant insert on table "public"."project_member" to "service_role";

grant references on table "public"."project_member" to "service_role";

grant select on table "public"."project_member" to "service_role";

grant trigger on table "public"."project_member" to "service_role";

grant truncate on table "public"."project_member" to "service_role";

grant update on table "public"."project_member" to "service_role";

grant delete on table "public"."user_settings" to "anon";

grant insert on table "public"."user_settings" to "anon";

grant references on table "public"."user_settings" to "anon";

grant select on table "public"."user_settings" to "anon";

grant trigger on table "public"."user_settings" to "anon";

grant truncate on table "public"."user_settings" to "anon";

grant update on table "public"."user_settings" to "anon";

grant delete on table "public"."user_settings" to "authenticated";

grant insert on table "public"."user_settings" to "authenticated";

grant references on table "public"."user_settings" to "authenticated";

grant select on table "public"."user_settings" to "authenticated";

grant trigger on table "public"."user_settings" to "authenticated";

grant truncate on table "public"."user_settings" to "authenticated";

grant update on table "public"."user_settings" to "authenticated";

grant delete on table "public"."user_settings" to "service_role";

grant insert on table "public"."user_settings" to "service_role";

grant references on table "public"."user_settings" to "service_role";

grant select on table "public"."user_settings" to "service_role";

grant trigger on table "public"."user_settings" to "service_role";

grant truncate on table "public"."user_settings" to "service_role";

grant update on table "public"."user_settings" to "service_role";

grant delete on table "public"."workspace" to "anon";

grant insert on table "public"."workspace" to "anon";

grant references on table "public"."workspace" to "anon";

grant select on table "public"."workspace" to "anon";

grant trigger on table "public"."workspace" to "anon";

grant truncate on table "public"."workspace" to "anon";

grant update on table "public"."workspace" to "anon";

grant delete on table "public"."workspace" to "authenticated";

grant insert on table "public"."workspace" to "authenticated";

grant references on table "public"."workspace" to "authenticated";

grant select on table "public"."workspace" to "authenticated";

grant trigger on table "public"."workspace" to "authenticated";

grant truncate on table "public"."workspace" to "authenticated";

grant update on table "public"."workspace" to "authenticated";

grant delete on table "public"."workspace" to "service_role";

grant insert on table "public"."workspace" to "service_role";

grant references on table "public"."workspace" to "service_role";

grant select on table "public"."workspace" to "service_role";

grant trigger on table "public"."workspace" to "service_role";

grant truncate on table "public"."workspace" to "service_role";

grant update on table "public"."workspace" to "service_role";

grant delete on table "public"."workspace_member" to "anon";

grant insert on table "public"."workspace_member" to "anon";

grant references on table "public"."workspace_member" to "anon";

grant select on table "public"."workspace_member" to "anon";

grant trigger on table "public"."workspace_member" to "anon";

grant truncate on table "public"."workspace_member" to "anon";

grant update on table "public"."workspace_member" to "anon";

grant delete on table "public"."workspace_member" to "authenticated";

grant insert on table "public"."workspace_member" to "authenticated";

grant references on table "public"."workspace_member" to "authenticated";

grant select on table "public"."workspace_member" to "authenticated";

grant trigger on table "public"."workspace_member" to "authenticated";

grant truncate on table "public"."workspace_member" to "authenticated";

grant update on table "public"."workspace_member" to "authenticated";

grant delete on table "public"."workspace_member" to "service_role";

grant insert on table "public"."workspace_member" to "service_role";

grant references on table "public"."workspace_member" to "service_role";

grant select on table "public"."workspace_member" to "service_role";

grant trigger on table "public"."workspace_member" to "service_role";

grant truncate on table "public"."workspace_member" to "service_role";

grant update on table "public"."workspace_member" to "service_role";

create policy "Allow All"
on "public"."organization_member"
as permissive
for all
to anon, authenticated
using (true);


CREATE TRIGGER asset_size_and_count_trigger AFTER INSERT OR DELETE OR UPDATE ON public.asset FOR EACH ROW EXECUTE FUNCTION update_asset_group_size_and_count();

CREATE TRIGGER asset_group_size_and_count_trigger AFTER INSERT OR DELETE OR UPDATE ON public.asset_group FOR EACH ROW EXECUTE FUNCTION update_project_size_and_count();

CREATE TRIGGER on_project_insert AFTER INSERT ON public.project FOR EACH ROW EXECUTE FUNCTION handle_project_insert();

CREATE TRIGGER project_size_trigger AFTER INSERT OR DELETE OR UPDATE ON public.project FOR EACH ROW EXECUTE FUNCTION update_workspace_size();


