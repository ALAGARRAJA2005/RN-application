# FreshMart - React Native Daily Grocery Mobile App 🛒🥦

> **Full Stack Development Model Examination Project**
> Total Marks: **75 Marks** (Part I: 30 Marks, Part II: 30 Marks, Part III: 15 Marks)

A complete, production-grade React Native & Expo application matching modern grocery Figma designs with high-fidelity UI, emerald green theme, full in-memory state management, and all required navigation types.

---

## 📱 Quick Start

### 1. Run Dev Server
```bash
npx expo start
```

### 2. Run on Browser (Web)
```bash
npx expo start --web
# or
npm run web
```

### 3. Run on Android Device / Emulator
```bash
npx expo start --android
```

---

## 🌟 Marking Breakdown & Feature Mapping

### Part – I: React Native Screens (30 Marks)

| # | Screen Name | Role Access | Marks | Location | Key Features |
|---|-------------|-------------|:-----:|----------|--------------|
| **1** | **Home Screen (Sign In & Sign Up)** | Admin & Customer | **5 Marks** | [`src/screens/auth/AuthHomeScreen.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/screens/auth/AuthHomeScreen.js) | **3D floating & gyro tilting fruit cluster**, segmented Sign In / Sign Up toggle, role selection tabs, input validation, 1-tap examiner quick login buttons. |
| **2** | **Daily Grocery Food Products List** | Admin & Customer | **5 Marks** | [`src/screens/products/ProductsListScreen.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/screens/products/ProductsListScreen.js) | Category chips, real-time search, **3D tilt card animations**, discount tags, rating stars, quick add-to-cart (Customer only), Admin "+ Add Product" modal with validation. |
| **3** | **Profile & Edit Profile Screen** | Customer | **5 Marks** | [`src/screens/profile/ProfileScreen.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/screens/profile/ProfileScreen.js) & [`src/screens/profile/EditProfileScreen.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/screens/profile/EditProfileScreen.js) | Avatar, Member tier badge, wallet balance, order history count, edit form with validation (Name, 10-digit phone, address). |
| **4** | **Add Favorite Screen** | Customer | **5 Marks** | [`src/screens/favorites/FavoritesScreen.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/screens/favorites/FavoritesScreen.js) | Wishlist list, remove from favorites, **Add to Cart per item**, **"Add All to Cart"** 1-tap action, empty state. |
| **5** | **Product Details Screen** | Customer | **5 Marks** | [`src/screens/products/ProductDetailsScreen.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/screens/products/ProductDetailsScreen.js) | **3D turntable rotating hero showcase**, origin & ratings, description, nutritional value breakdown, **Quantity Stepper `[-] qty [+]`**, floating Add to Cart button (Customer only). |
| **6** | **My Cart Screen** | Customer (Admin Blocked) | **5 Marks** | [`src/screens/cart/CartScreen.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/screens/cart/CartScreen.js) | **Strictly Customer-only**. Cart list, **Add (+) or Subtract (-)** vertical quantity steppers, bill breakdown in Rs, address preview, order placement modal. |

---

### Part – II: React Navigation (30 Marks)

This project implements **all 3 major navigation systems**:

1. **Stack Navigation (10 Marks)**:
   - Root Native Stack Navigator implemented in [`src/navigation/RootNavigator.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/navigation/RootNavigator.js).
   - Manages Transitions:
     - `AuthHome` (Login/Signup)
     - `MainDrawer` (Container for Drawer + Tabs)
     - `ProductDetails` (Modal / slide-up stack screen)
     - `EditProfile` (Slide-in stack screen)

2. **Tabs Navigation (10 Marks)**:
   - Bottom Tab Navigator implemented in [`src/navigation/TabNavigator.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/navigation/TabNavigator.js).
   - 4 Interactive Tabs:
     - 🛒 **Groceries Tab** (`ProductsListScreen`)
     - ❤️ **Favorites Tab** (`FavoritesScreen`) - with live badge of wishlist items
     - 🛍️ **My Cart Tab** (`CartScreen`) - with dynamic badge showing cart item count
     - 👤 **Profile Tab** (`ProfileScreen`)

3. **Drawer Navigation (10 Marks)**:
   - Side Drawer Navigator implemented in [`src/navigation/DrawerNavigator.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/navigation/DrawerNavigator.js).
   - Custom Drawer Header & Menu in [`src/navigation/CustomDrawerContent.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/navigation/CustomDrawerContent.js):
     - User Avatar, Name, Email, and Role Badge (`ADMIN` or `CUSTOMER`).
     - 1-tap **Role Switcher** toggle directly in Drawer!
     - Quick navigation links to Products, Favorites, Cart, Customer Profile, and Sign Out.

---

### Part – III: Functional Requirements (15 Marks)

1. **All users can navigate each screen (5 Marks)**:
   - Top Header with drawer trigger, back buttons, bottom tab bar, and direct screen transitions.
   - Role permissions: screens indicate Customer vs Admin roles and allow testing both seamlessly.
2. **Add single or multiple products from products screen and/or favorite screen to cart (5 Marks)**:
   - From **Products Screen**: Quick single tap adds 1, or click card to open details.
   - From **Product Details Screen**: Quantity selector (`[-] 1, 2, 3... [+]`) adds multiple items at once.
   - From **Favorites Screen**: Each item has an "+ Add to Cart" button, plus an "Add All to Cart" button.
3. **Add or Subtract items in cart screen (5 Marks)**:
   - On the **My Cart Screen**, every item has working `+` (increment) and `-` (decrement) buttons.
   - When quantity reaches 1, pressing subtract prompts to remove the item.
   - Cart subtotal, delivery fee, discounts, and grand total recalculate immediately in real-time.

---

### Important Notes Addressed:

- **Figma Design Match (>75%)**:
  - Theme colors: Emerald green (`#059669`), crisp white cards (`#FFFFFF`), slate dark typography (`#0F172A`), amber ratings/discounts (`#F59E0B`).
  - Sleek modern elevations, rounded pill category chips, badge counters, and floating bars.
- **3D Animations**:
  - 3D floating & gyro tilt on the welcome fruit cluster with dynamic ground shadow.
  - 3D card tilt & touch depth on product cards (`perspective: 900`, `rotateX`, `rotateY`).
  - 3D turntable rotating hero showcase on product details.
- **Role Control**:
  - Cart strictly Customer-only (Admin cannot access or see cart; Admin has stock management).
- **Basic Validation**:
  - **Auth**: Name (>=3 chars), Email regex, Password (>=6 chars), 10-digit Phone, Password match.
  - **Edit Profile**: Name validation, 10-digit mobile number, address required.
  - **Admin Add Product**: Name, category, positive price, unit, stock count, description validation.
- **No Backend / Database Required**:
  - Centralized state in React Context ([`src/context/AppContext.js`](file:///c:/Users/salag/Desktop/fsd%20model%20exam/RN%20model/src/context/AppContext.js)) with pre-seeded grocery items, cart items, favorites, and demo accounts.

---

## 📂 Project Directory Structure

```
RN model/
├── App.js                         # Root App with Providers & NavigationContainer
├── index.js                       # Entry point with Gesture Handler registration
├── package.json                   # Dependencies (Expo SDK 58, React Navigation, Reanimated)
├── app.json                       # App configuration metadata
└── src/
    ├── context/
    │   └── AppContext.js          # Global State (Auth, Products, Cart, Favorites)
    ├── data/
    │   └── mockData.js            # Initial grocery products & demo users
    ├── theme/
    │   └── colors.js              # Emerald green and slate color palette
    ├── components/
    │   ├── Header.js              # Top bar with drawer toggle, role switch, cart badge
    │   ├── ProductCard.js         # Grocery card with rating, discount, cart action
    │   └── Toast.js               # Interactive feedback notification banner
    ├── navigation/
    │   ├── RootNavigator.js       # Stack Navigation
    │   ├── DrawerNavigator.js     # Drawer Navigation
    │   ├── TabNavigator.js        # Bottom Tabs Navigation
    │   └── CustomDrawerContent.js # Custom Drawer Sidebar
    └── screens/
        ├── auth/
        │   └── AuthHomeScreen.js  # Screen 1: Home (Sign Up & Sign In)
        ├── products/
        │   ├── ProductsListScreen.js   # Screen 2: Daily Grocery Products List
        │   └── ProductDetailsScreen.js # Screen 5: Product Details
        ├── profile/
        │   ├── ProfileScreen.js        # Screen 3: Customer Profile
        │   └── EditProfileScreen.js    # Screen 3: Edit Profile with Validation
        ├── favorites/
        │   └── FavoritesScreen.js      # Screen 4: Add Favorite Screen
        ├── cart/
        │   └── CartScreen.js           # Screen 6: My Cart Screen
        └── admin/
            └── AdminProductModal.js    # Admin Add Product modal with validation
```
