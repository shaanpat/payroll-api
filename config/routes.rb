Rails.application.routes.draw do
  get 'about', :to => 'home#about'
  get 'faq', :to => 'home#faq'
  get 'confirmation', :to => 'accounts#confirmation'
  get 'get-started', :to => 'accounts#new'
  get 'privacy-policy', :to => 'home#privacy_policy'
  get 'terms-of-service', :to => 'home#terms_of_service'

  resources :accounts
  
  root 'home#index'
end
