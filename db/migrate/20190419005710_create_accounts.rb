class CreateAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts do |t|
      t.string :provider
      t.string :name
      t.string :username

      t.timestamps
    end
  end
end
