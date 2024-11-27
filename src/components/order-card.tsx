import React from 'react';

interface OrderCardProps {
  orderId: string;
  status: string;
  customerName: string;
  orderDate: string;
  amount: number;
}

const OrderCard: React.FC<OrderCardProps> = ({ orderId, status, customerName, orderDate, amount }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-gray-700 dark:text-gray-300">
            #{orderId}
          </span>
          <span className={`font-medium ${status === 'Shipped' ? 'text-green-500' : 'text-red-500'}`}>
            {status}
          </span>
        </div>
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">
          {customerName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {orderDate}
        </p>
      </div>
      <div className="text-right">
        <span className="font-medium text-gray-800 dark:text-gray-200">
          ${amount.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;