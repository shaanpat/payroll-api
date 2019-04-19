class AccountsController < ApplicationController
	def new
		@account = Account.new
	end

	def create
	  @account = Account.new(account_params)
	 
	  if @account.save
	    redirect_to @account
	  else
	    render 'new'
	  end
	end


	private
	  def account_params
	    params.require(:account).permit(:provider, :name, :username)
	  end
end
