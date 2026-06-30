"""
Seed script to populate the database with initial data.
Run this after setting up your database.

Usage: python seed_data.py
"""

from app.database import SessionLocal, engine, Base
from app.models import Category, MenuItem, Table, Admin
from app.auth import get_password_hash

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # Check if data already exists
    # if db.query(Category).first():
    #     print("Database already has data. Skipping seed.")
    # else:
    #     print("Seeding database...")

    #     # Create categories
    #     categories = [
    #         Category(name="Appetizers", description="Start your meal with our delicious appetizers", display_order=1),
    #         Category(name="Main Course", description="Hearty main dishes to satisfy your appetite", display_order=2),
    #         Category(name="Pasta & Risotto", description="Italian classics made with love", display_order=3),
    #         Category(name="Seafood", description="Fresh catches from the sea", display_order=4),
    #         Category(name="Desserts", description="Sweet endings to your meal", display_order=5),
    #         Category(name="Beverages", description="Refreshing drinks and cocktails", display_order=6),
    #     ]
    #     db.add_all(categories)
    #     db.commit()

    #     # Refresh to get IDs
    #     for cat in categories:
    #         db.refresh(cat)

    #     # Create menu items
    #     menu_items = [
    #         # Appetizers
    #         MenuItem(
    #             name="Bruschetta Trio",
    #             description="Three varieties of our signature bruschetta with tomato basil, mushroom, and olive tapenade",
    #             price=12.99,
    #             category_id=categories[0].id,
    #             is_vegetarian=True,
    #             prep_time_minutes=10
    #         ),
    #         MenuItem(
    #             name="Crispy Calamari",
    #             description="Lightly battered calamari served with marinara sauce and lemon aioli",
    #             price=14.99,
    #             category_id=categories[0].id,
    #             prep_time_minutes=12
    #         ),
    #         MenuItem(
    #             name="Soup of the Day",
    #             description="Ask your server about today's freshly made soup",
    #             price=8.99,
    #             category_id=categories[0].id,
    #             is_vegetarian=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=5
    #         ),
    #         MenuItem(
    #             name="Garlic Bread",
    #             description="Toasted ciabatta with garlic butter and herbs",
    #             price=6.99,
    #             category_id=categories[0].id,
    #             is_vegetarian=True,
    #             prep_time_minutes=8
    #         ),

    #         # Main Course
    #         MenuItem(
    #             name="Grilled Ribeye Steak",
    #             description="12oz prime ribeye with roasted vegetables and your choice of sauce",
    #             price=38.99,
    #             category_id=categories[1].id,
    #             is_gluten_free=True,
    #             prep_time_minutes=25
    #         ),
    #         MenuItem(
    #             name="Herb Roasted Chicken",
    #             description="Half chicken with rosemary potatoes and seasonal vegetables",
    #             price=24.99,
    #             category_id=categories[1].id,
    #             is_gluten_free=True,
    #             prep_time_minutes=20
    #         ),
    #         MenuItem(
    #             name="Lamb Chops",
    #             description="New Zealand lamb chops with mint pesto and mashed potatoes",
    #             price=34.99,
    #             category_id=categories[1].id,
    #             is_gluten_free=True,
    #             prep_time_minutes=22
    #         ),
    #         MenuItem(
    #             name="Vegetable Wellington",
    #             description="Seasonal vegetables wrapped in puff pastry with mushroom sauce",
    #             price=22.99,
    #             category_id=categories[1].id,
    #             is_vegetarian=True,
    #             is_vegan=False,
    #             prep_time_minutes=25
    #         ),

    #         # Pasta & Risotto
    #         MenuItem(
    #             name="Spaghetti Carbonara",
    #             description="Classic carbonara with pancetta, egg, parmesan, and black pepper",
    #             price=18.99,
    #             category_id=categories[2].id,
    #             prep_time_minutes=15
    #         ),
    #         MenuItem(
    #             name="Lobster Ravioli",
    #             description="Handmade ravioli filled with lobster in a creamy tomato sauce",
    #             price=28.99,
    #             category_id=categories[2].id,
    #             prep_time_minutes=18
    #         ),
    #         MenuItem(
    #             name="Mushroom Risotto",
    #             description="Creamy arborio rice with wild mushrooms and truffle oil",
    #             price=21.99,
    #             category_id=categories[2].id,
    #             is_vegetarian=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=20
    #         ),
    #         MenuItem(
    #             name="Penne Arrabbiata",
    #             description="Penne pasta in spicy tomato sauce with garlic and chili",
    #             price=16.99,
    #             category_id=categories[2].id,
    #             is_vegetarian=True,
    #             is_vegan=True,
    #             spice_level=2,
    #             prep_time_minutes=15
    #         ),

    #         # Seafood
    #         MenuItem(
    #             name="Pan-Seared Salmon",
    #             description="Atlantic salmon with lemon dill sauce and asparagus",
    #             price=28.99,
    #             category_id=categories[3].id,
    #             is_gluten_free=True,
    #             prep_time_minutes=18
    #         ),
    #         MenuItem(
    #             name="Grilled Sea Bass",
    #             description="Mediterranean sea bass with olive tapenade and roasted vegetables",
    #             price=32.99,
    #             category_id=categories[3].id,
    #             is_gluten_free=True,
    #             prep_time_minutes=20
    #         ),
    #         MenuItem(
    #             name="Seafood Platter",
    #             description="Lobster tail, jumbo shrimp, scallops, and crab legs with drawn butter",
    #             price=58.99,
    #             category_id=categories[3].id,
    #             is_gluten_free=True,
    #             prep_time_minutes=25
    #         ),
    #         MenuItem(
    #             name="Fish & Chips",
    #             description="Beer-battered cod with hand-cut fries and tartar sauce",
    #             price=19.99,
    #             category_id=categories[3].id,
    #             prep_time_minutes=15
    #         ),

    #         # Desserts
    #         MenuItem(
    #             name="Tiramisu",
    #             description="Classic Italian dessert with espresso-soaked ladyfingers and mascarpone",
    #             price=10.99,
    #             category_id=categories[4].id,
    #             is_vegetarian=True,
    #             prep_time_minutes=5
    #         ),
    #         MenuItem(
    #             name="Chocolate Lava Cake",
    #             description="Warm chocolate cake with molten center, served with vanilla ice cream",
    #             price=11.99,
    #             category_id=categories[4].id,
    #             is_vegetarian=True,
    #             prep_time_minutes=12
    #         ),
    #         MenuItem(
    #             name="Crème Brûlée",
    #             description="Classic vanilla custard with caramelized sugar top",
    #             price=9.99,
    #             category_id=categories[4].id,
    #             is_vegetarian=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=5
    #         ),
    #         MenuItem(
    #             name="Fresh Fruit Sorbet",
    #             description="Three scoops of seasonal fruit sorbet",
    #             price=8.99,
    #             category_id=categories[4].id,
    #             is_vegetarian=True,
    #             is_vegan=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=3
    #         ),

    #         # Beverages
    #         MenuItem(
    #             name="Fresh Lemonade",
    #             description="House-made lemonade with fresh mint",
    #             price=4.99,
    #             category_id=categories[5].id,
    #             is_vegetarian=True,
    #             is_vegan=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=3
    #         ),
    #         MenuItem(
    #             name="Espresso",
    #             description="Double shot of Italian espresso",
    #             price=3.99,
    #             category_id=categories[5].id,
    #             is_vegetarian=True,
    #             is_vegan=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=2
    #         ),
    #         MenuItem(
    #             name="Sparkling Water",
    #             description="San Pellegrino 750ml",
    #             price=5.99,
    #             category_id=categories[5].id,
    #             is_vegetarian=True,
    #             is_vegan=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=1
    #         ),
    #         MenuItem(
    #             name="House Red Wine",
    #             description="Glass of our selected house red wine",
    #             price=9.99,
    #             category_id=categories[5].id,
    #             is_vegetarian=True,
    #             is_vegan=True,
    #             is_gluten_free=True,
    #             prep_time_minutes=1
    #         ),
    #     ]
    #     db.add_all(menu_items)
    #     db.commit()

    #     # Create tables
    #     tables = [
    #         Table(table_number="T1", capacity=2, location="Main Hall"),
    #         Table(table_number="T2", capacity=2, location="Main Hall"),
    #         Table(table_number="T3", capacity=4, location="Main Hall"),
    #         Table(table_number="T4", capacity=4, location="Main Hall"),
    #         Table(table_number="T5", capacity=6, location="Main Hall"),
    #         Table(table_number="T6", capacity=6, location="Main Hall"),
    #         Table(table_number="P1", capacity=2, location="Patio"),
    #         Table(table_number="P2", capacity=4, location="Patio"),
    #         Table(table_number="P3", capacity=4, location="Patio"),
    #         Table(table_number="VIP1", capacity=8, location="Private Room"),
    #         Table(table_number="VIP2", capacity=10, location="Private Room"),
    #     ]
    #     db.add_all(tables)
    #     db.commit()

        # Create default admin
        admin = Admin(
            email="admin2@sonaee.com",
            full_name="Admin User",
            hashed_password=get_password_hash("admin7171"),
            is_superadmin=True
        )
        db.add(admin)
        db.commit()

        print("Database seeded successfully!")
        print("\nDefault admin credentials:")
        print("  Email: admincreds@sonaee.com")
        print("  Password: admin7171")

finally:
    db.close()
