class Account < ApplicationRecord
	validates :username, :provider, presence: true
	validates :username, length: { minimum: 3 }
end
