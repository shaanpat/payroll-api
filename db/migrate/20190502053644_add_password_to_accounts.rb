class AddPasswordToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_column :accounts, :encrypted_password, :string
    add_column :accounts, :encrypted_password_iv, :string
  end
end
