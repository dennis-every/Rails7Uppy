class CreatePhotos < ActiveRecord::Migration[7.0]
  def change
    create_table :photos do |t|

      t.timestamps
    end
  end
end
