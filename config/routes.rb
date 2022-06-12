Rails.application.routes.draw do
  resources :photos
  root "photos#index"
  get 'home/index'
end
