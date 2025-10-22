from app import create_app, mongo

app = create_app()

with app.app_context():
    print("Collections in MongoDB:", mongo.db.list_collection_names())
