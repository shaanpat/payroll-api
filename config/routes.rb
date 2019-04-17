Rails.application.routes.draw do
  get 'home/index'
  get 'home/contact'
  get 'home/faq'
  get 'home/privacy_policy'
  get 'home/terms_of_service'
  
  root 'home#index'
end
