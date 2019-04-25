class AccountsController < ApplicationController
	def new
		@account = Account.new
	end

	# https://www.justinweiss.com/articles/respond-to-without-all-the-pain/
	def create
	  @account = Account.new(account_params)
	 
	  if @account.save
		respond_to do |format|
		  format.json do
		    render json: {
		      provider: @account.provider,
		      username: @account.username
		    }.to_json
		  end

		  format.html do
			redirect_to '/confirmation'
		  end
		end
	  else
	  	respond_to do |format|
	  		format.json do
	  			render json: {
	  				errors: @account.errors 
	  			}.to_json
	  		end

	  		format.html do
	  			render 'new'
	  		end
	  	end
	  end
	end

	def confirmation
	end


	private
	  def account_params
	    params.require(:account).permit(:provider, :username)
	  end
end
