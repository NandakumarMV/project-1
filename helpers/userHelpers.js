const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Address = require("../models/addressesModel");
const Product = require("../models/productModels");

const walletModel = require("../models/walletModel");

module.exports = {
  walletBalance: (userId) => {
    console.log("wallet balancee controller");
    return new Promise(async (resolve, reject) => {
      try {
        const walletBalance = await walletModel.findOne({ userId });
        const walletAmount = walletBalance.walletAmount;
        resolve(walletAmount);
      } catch (error) {
        reject(error);
      }
    });
  },

  updatewallet: (userId, orderId) => {
    console.log("reached helper for wallet");
    return new Promise(async (resolve, reject) => {
      try {
        const orderdetails = await Order.findOne({ _id: orderId });
        console.log(orderdetails, "orderdetails");
        const wallet = await walletModel.findOne({ userId: userId });
        console.log(wallet, "wallet is this");
        if (wallet) {
          const updatedWalletAmount =
            wallet.walletAmount - orderdetails.orderValue;
          const updatedWallet = await walletModel.findOneAndUpdate(
            { userId: userId },
            { $set: { walletAmount: updatedWalletAmount } }
          );
          console.log(updatedWalletAmount, "updatedWalletAmount");

          resolve(updatedWalletAmount);
        } else {
          reject("wallet not find");
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  updateProductStock: async (orderedProducts) => {
    try {
      console.log("reached updatedproductstock");
      for (const orderedProduct of orderedProducts) {
        const productId = orderedProduct.productId;
        const quantity = orderedProduct.quantity;

        // Find the product by its ID
        const product = await Product.findById(productId);

        // Update the product stock by subtracting the ordered quantity
        product.inStock -= quantity;

        // Save the updated product
        await product.save();
      }
    } catch (error) {}
  },
};
