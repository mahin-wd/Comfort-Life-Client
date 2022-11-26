import { useQuery } from '@tanstack/react-query';
import React, { useContext } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../Context/AuthProvider';

const MyOrders = () => {
    const { user, loader } = useContext(AuthContext);

    // const url = `http://localhost:5000/orders?email=${user.email}`
    //     fetch(url)
    //         .then(res => res.json())
    //         .then(data => setFurnitures(data));

    const { data: furnitures = [], refetch } = useQuery({
        queryKey: 'myOrders',
        queryFn: async () => {
            const url = `http://localhost:5000/orders?email=${user.email}`
            const res = await fetch(url);
            const data = await res.json();
            return data;
        }
    })

    const deleteOrder = id => {
        fetch(`http://localhost:5000/orders/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged === true) {
                    toast.success("Removed order from wishlist successfully");
                    refetch();
                }
            })
    }


    if (loader) {
        return <div className='min-h-screen'><h3 className='text-3xl text-primary mt-80'>Loading...</h3></div>
    }

    return (
        <div>
            <div className="overflow-x-auto w-full">
                <table className="table w-full">
                    <thead>
                        <tr>
                            <th className='bg-white text-gray-400 text-start text-sm'></th>
                            <th className='bg-white text-gray-400 text-start text-sm'>Name</th>
                            <th className='bg-white text-gray-400 text-start text-sm'>Price</th>
                            <th className='bg-white text-gray-400 text-start text-sm'></th>
                        </tr>
                    </thead>

                    <tbody>
                        {
                            furnitures.map((furniture, i) => <tr key={furniture._id}>
                                <th className='text-xl text-gray-500 text-semibold'>{i + 1}</th>
                                <td className='text-xl text-gray-500 text-semibold'>{furniture.productName}</td>
                                <td className='text-xl text-gray-500 text-semibold'>${furniture.price}</td>
                                <td className='text-center'>

                                </td>
                                <td>
                                    <Link to="/dashboard/payment">
                                        <button className="btn-primary btn-sm rounded-lg text-white font-semibold">Purchase</button>
                                    </Link>
                                </td>
                                <td><p onClick={() => deleteOrder(furniture._id)} className='btn btn-xs btn-outline btn-error'>Delete</p>
                                </td>
                            </tr>)
                        }
                    </tbody>

                </table>
            </div>
        </div>
    );
};

export default MyOrders;