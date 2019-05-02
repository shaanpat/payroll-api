class Account < ApplicationRecord
	validates :username, :provider, presence: true
	validates :username, length: { minimum: 3 }

	attr_encrypted :password, key: ENV["PASSWORD_ENCRYPTION_KEY"]
end
