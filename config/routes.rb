Rails.application.routes.draw do
  get 'home/index'
  get 'about', :to => 'home#about'
  get 'privacy-policy', :to => 'home#privacy_policy'
  get 'terms-of-service', :to => 'home#terms_of_service'
  get 'faq', :to => 'home#faq'

  resources :accounts
  
  root 'home#index'
end
