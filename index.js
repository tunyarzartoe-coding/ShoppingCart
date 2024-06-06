$(document).ready(function() {
    const tblProducts = "products";
    getProducts();

    function getProducts() {
        const products = JSON.parse(localStorage.getItem(tblProducts)) || [];
        let productTable = $('#productTable').DataTable();
        productTable.clear();
        products.forEach(product => {
            productTable.row.add([
                product.name,
                product.price,
                `<button class="btn btn-success add-to-cart">Add to Cart</button>
                 <button class="btn btn-warning edit-product">Edit</button>
                 <button class="btn btn-danger delete-product">Delete</button>`
            ]).draw();
        });
    }

    function createProduct(name, price) {
        let products = JSON.parse(localStorage.getItem(tblProducts)) || [];
        const newProduct = { id: uuidv4(), name: name, price: price };
        products.push(newProduct);
        localStorage.setItem(tblProducts, JSON.stringify(products));
        successNotifyMessage("Product successfully created!");
        getProducts();
    }

    function updateProduct(id, name, price) {
        let products = JSON.parse(localStorage.getItem(tblProducts)) || [];
        const index = products.findIndex(product => product.id === id);
        if (index !== -1) {
            products[index] = { id: id, name: name, price: price };
            localStorage.setItem(tblProducts, JSON.stringify(products));
            successNotifyMessage("Product successfully updated!");
            getProducts();
        } else {
            errorNotifyMessage("Product not found.");
        }
    }

    function deleteProduct(id) {
        let products = JSON.parse(localStorage.getItem(tblProducts)) || [];
        products = products.filter(product => product.id !== id);
        localStorage.setItem(tblProducts, JSON.stringify(products));
        successNotifyMessage("Product successfully deleted!");
        getProducts();
    }

    function uuidv4() {
        return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
            (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)
        );
    }

    $('#addProductBtn').on('click', function() {
        Swal.fire({
            title: 'Add New Product',
            html: '<input id="productName" class="swal2-input" placeholder="Product Name">' +
                  '<input id="productPrice" class="swal2-input" placeholder="Product Price">',
            showCancelButton: true,
            confirmButtonText: 'Add',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#productName').value;
                const price = Swal.getPopup().querySelector('#productPrice').value;
                if (!name || !price) {
                    Notiflix.Notify.failure('Please enter product name and price');
                    return false;
                }
                return { name: name, price: price };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                createProduct(result.value.name, result.value.price);
            }
        });
    });

    $('#productTable tbody').on('click', '.edit-product', function() {
        let productTable = $('#productTable').DataTable();
        let productRow = productTable.row($(this).closest('tr'));
        let productData = productRow.data();
        let productName = productData[0];
        let productPrice = productData[1];

        Swal.fire({
            title: 'Edit Product',
            html: `<input id="productName" class="swal2-input" value="${productName}" placeholder="Product Name">
                   <input id="productPrice" class="swal2-input" value="${productPrice}" placeholder="Product Price">`,
            showCancelButton: true,
            confirmButtonText: 'Update',
            cancelButtonText: 'Cancel',
            preConfirm: () => {
                const name = Swal.getPopup().querySelector('#productName').value;
                const price = Swal.getPopup().querySelector('#productPrice').value;
                if (!name || !price) {
                    Notiflix.Notify.failure('Please enter product name and price');
                    return false;
                }
                return { name: name, price: price };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let products = JSON.parse(localStorage.getItem(tblProducts)) || [];
                const product = products.find(product => product.name === productName);
                if (product) {
                    updateProduct(product.id, result.value.name, result.value.price);
                }
            }
        });
    });

    $('#productTable tbody').on('click', '.delete-product', function() {
        let productTable = $('#productTable').DataTable();
        let productRow = productTable.row($(this).closest('tr'));
        let productData = productRow.data();
        let productName = productData[0];

        Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete ${productName}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        }).then((result) => {
            if (result.isConfirmed) {
                let products = JSON.parse(localStorage.getItem(tblProducts)) || [];
                const product = products.find(product => product.name === productName);
                if (product) {
                    deleteProduct(product.id);
                }
            }
        });
    });

    $('#productTable tbody').on('click', '.add-to-cart', function() {
        let productTable = $('#productTable').DataTable();
        let productRow = productTable.row($(this).closest('tr'));
        let productData = productRow.data();
        let productName = productData[0];
        let productPrice = productData[1];

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push({ name: productName, price: productPrice });
        localStorage.setItem('cart', JSON.stringify(cart));

        Swal.fire({
            title: 'Added to Cart',
            text: `${productName} has been added to your cart!`,
            icon: 'success',
            confirmButtonText: 'OK'
        });
    });

    function successNotifyMessage(message) {
        Notiflix.Notify.success(message);
    }

    function errorNotifyMessage(message) {
        Notiflix.Notify.failure(message);
    }

    function successMessage(message) {
        Swal.fire({
            title: "Success!",
            text: message,
            icon: "success",
        });
    }

    function errorMessage(message) {
        Swal.fire({
            title: "Error!",
            text: message,
            icon: "error",
        });
    }
});
