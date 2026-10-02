-- Seed Roles
INSERT INTO public.roles (id, name, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'KID', 'Child learner with creative writing and reading quests access'),
  ('22222222-2222-2222-2222-222222222222', 'FAMILY', 'Parent or guardian managing child accounts and progress'),
  ('33333333-3333-3333-3333-333333333333', 'TEACHER', 'Educator managing classroom assignments, feedback, and student cohorts'),
  ('44444444-4444-4444-4444-444444444444', 'ADMIN', 'Administrative staff overseeing content, users, and operational reports'),
  ('55555555-5555-5555-5555-555555555555', 'SUPERADMIN', 'System administrator with complete platform privileges')
ON CONFLICT (name) DO NOTHING;

-- Seed Permissions
INSERT INTO public.permissions (name, description)
VALUES
  ('users.read', 'View user profiles'),
  ('users.create', 'Create new users'),
  ('users.update', 'Update existing users'),
  ('users.delete', 'Soft-delete or purge users'),
  ('kids.read', 'View kids data and progress'),
  ('kids.create', 'Create kid profiles'),
  ('kids.update', 'Update kid profiles and rewards'),
  ('kids.delete', 'Delete kid profiles'),
  ('families.read', 'View family profiles and members'),
  ('families.create', 'Register new family units'),
  ('families.update', 'Update family settings'),
  ('families.delete', 'Remove family units'),
  ('teachers.read', 'View teacher profiles'),
  ('teachers.create', 'Register teacher accounts'),
  ('teachers.update', 'Update teacher information'),
  ('teachers.delete', 'Deactivate teacher accounts'),
  ('content.read', 'Read stories, prompts, and creatures'),
  ('content.create', 'Create stories, prompts, or creatures'),
  ('content.update', 'Edit story prompts and moderate content'),
  ('content.delete', 'Remove inappropriate content'),
  ('reports.read', 'View analytical and moderation reports'),
  ('admins.read', 'View admin staff accounts'),
  ('admins.create', 'Invite or create new admins'),
  ('admins.update', 'Update admin profiles and access'),
  ('admins.delete', 'Deactivate admin accounts'),
  ('roles.read', 'View roles and permission matrices'),
  ('roles.create', 'Define custom roles'),
  ('roles.update', 'Update role permissions'),
  ('roles.delete', 'Delete custom roles'),
  ('system.settings', 'Manage core platform configuration'),
  ('audit_logs.read', 'View system audit trails')
ON CONFLICT (name) DO NOTHING;

-- Map Superadmin to all permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '55555555-5555-5555-5555-555555555555', id FROM public.permissions
ON CONFLICT DO NOTHING;

-- Map Admin permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '44444444-4444-4444-4444-444444444444', id FROM public.permissions
WHERE name IN (
  'users.read', 'users.update',
  'kids.read', 'kids.create', 'kids.update', 'kids.delete',
  'families.read', 'families.create', 'families.update',
  'teachers.read', 'teachers.create', 'teachers.update',
  'content.read', 'content.create', 'content.update', 'content.delete',
  'reports.read', 'audit_logs.read'
)
ON CONFLICT DO NOTHING;

-- Map Teacher permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '33333333-3333-3333-3333-333333333333', id FROM public.permissions
WHERE name IN ('kids.read', 'teachers.read', 'teachers.update', 'content.read', 'content.create', 'content.update', 'reports.read')
ON CONFLICT DO NOTHING;

-- Map Family permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '22222222-2222-2222-2222-222222222222', id FROM public.permissions
WHERE name IN ('kids.read', 'families.read', 'families.update', 'content.read', 'reports.read')
ON CONFLICT DO NOTHING;

-- Map Kid permissions
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT '11111111-1111-1111-1111-111111111111', id FROM public.permissions
WHERE name IN ('content.read', 'content.create', 'content.update')
ON CONFLICT DO NOTHING;

-- Seed default system settings
INSERT INTO public.system_settings (key, value, description)
VALUES
  ('platform_name', '"Selam Kids - Night Zookeeper Edition"', 'Name of the educational creative writing platform'),
  ('allow_public_registration', 'true', 'Whether new visitors can register directly'),
  ('maintenance_mode', 'false', 'Global maintenance status'),
  ('default_orb_reward', '25', 'Default orbs awarded for completing a writing prompt'),
  ('max_creatures_per_kid', '10', 'Maximum number of magical animals a kid can draw/adopt')
ON CONFLICT (key) DO NOTHING;
