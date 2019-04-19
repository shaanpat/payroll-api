class AccountsController < ApplicationController
	def new
		@account = Account.new
	end

	def create
	  @account = Account.new(account_params)
	 
	  if @account.save
	    redirect_to '/confirmation'
	  else
	    render 'new'
	  end
	end

	def confirmation
	end


	private
	  def account_params
	    params.require(:account).permit(:provider, :name, :username)
	  end
end
