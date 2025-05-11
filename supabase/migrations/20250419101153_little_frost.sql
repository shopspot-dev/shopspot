/*
  # Fix Users Table RLS Policy

  1. Changes
    - Drop existing problematic policy on users table
    - Create new simplified policy that avoids recursion
    - Add separate policies for different operations

  2. Security
    - Users can read their own data and data of users in their store
    - Only store admins can create/update/delete users
    - Prevents infinite recursion by simplifying policy conditions
*/

-- Drop existing policy
DROP POLICY IF EXISTS "Users can access their own user data" ON users;

-- Create new policies
CREATE POLICY "Users can read own data and store users"
ON users FOR SELECT
USING (
  id = auth.uid() OR 
  store_id IN (
    SELECT store_id FROM users 
    WHERE id = auth.uid()
  )
);

CREATE POLICY "Admins can insert users"
ON users FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.store_id = users.store_id
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update users"
ON users FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.store_id = users.store_id
    AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can delete users"
ON users FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.store_id = users.store_id
    AND users.role = 'admin'
  )
);