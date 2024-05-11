import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import { Typewriter } from 'react-simple-typewriter';
import deleteImg from '../../assets/delete.svg';
import updateImg from '../../assets/update.svg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

const BookedServices = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [fetchNow, setFetchNow] = useState(true);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [bookingToUpdate, setBookingToUpdate] = useState({});
  const [serviceTakingDate, setServiceTakingDate] = useState(new Date());
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get(`/bookings?email=${user?.email}`).then(res => {
      setBookings(res.data);
    });
  }, [user?.email, axiosSecure, fetchNow]);

  const refetch = () => {
    setFetchNow(!fetchNow);
  };
  const handleDelete = id => {
    Swal.fire({
      title: 'Confirm to delete?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(result => {
      if (result.isConfirmed) {
        axiosSecure
          .delete(
            `${import.meta.env.VITE_API_URL}/delete-booking/${id}?email=${
              user?.email
            }`
          )
          .then(data => {
            if (data.data.deletedCount > 0) {
              Swal.fire(
                'Deleted!',
                'Your Booking has been deleted.',
                'success'
              );
              refetch();
            }
          });
      }
    });
  };

  const getDataForUpdate = async id => {
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/booking-details/${id}`
    );
    setBookingToUpdate(data);
    setServiceTakingDate(data.serviceTakingDate);
    setShowUpdateModal(true);
  };

  const handleUpdateBooking = async e => {
    e.preventDefault();
    const form = e.target;
    const instruction = form.instruction.value;
    const updateData = { instruction, serviceTakingDate };

    const { data } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/update-booking/${bookingToUpdate._id}`,
      updateData
    );
    if (data.modifiedCount > 0) {
      Swal.fire('Updated!', 'Your Booking has been updated.', 'success');
      setShowUpdateModal(false);
      setBookingToUpdate({});
      refetch();
    }
  };

  return (
    <div className="my-10 sm:px-6">
      <Helmet>
        <title>GlamSpot | My Bookings</title>
      </Helmet>

      <span style={{ color: '#fa237d', fontWeight: 'bold' }}>
        <Typewriter
          words={['My Booked Services']}
          loop={50}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1500}
        />
      </span>

      <div className="overflow-x-auto rounded-2xl border border-black mt-8">
        <table className="table table-zebra">
          {/* head starts here */}
          <thead className="bg-green-400">
            <tr>
              <th className="text-sm text-black">Sl</th>
              <th className="text-sm text-black">Service Name</th>
              <th className="text-sm text-black">Area</th>
              <th className="text-sm text-black">Price</th>
              <th className="text-sm text-black">Provider Name</th>
              <th className="text-sm text-black">Update</th>
              <th className="text-sm text-black">Delete</th>
            </tr>
          </thead>
          <tbody>
            {/* row starts here */}
            {bookings?.map((booking, i) => (
              <tr key={booking._id}>
                <th>{i + 1}.</th>
                <td>{booking.serviceName}</td>
                <td>{booking.serviceArea}</td>
                <td>$ {booking.servicePrice}</td>
                <td>{booking.providerName}</td>
                <td>
                  <div onClick={() => getDataForUpdate(booking._id)}>
                    <img src={updateImg} alt="update-booking" className="w-6" />
                  </div>
                </td>
                <td>
                  <div onClick={() => handleDelete(booking._id)}>
                    <img src={deleteImg} alt="delete-booking" className="w-6" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showUpdateModal && (
        <div className=" fixed top-0 left-0 flex justify-center items-center h-screen w-full z-10">
          <div className="w-2/3 h-5/6 rounded bg-red-200 text-center">
            <div className="mt-8 mx-auto w-full md:w-2/3">
              <form onSubmit={handleUpdateBooking}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left side */}
                  <div className="flex-1">
                    <label className="block mt-4 mb-1 text-red-500">
                      Service Name {'(unchangeable)'}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="text"
                      required
                      defaultValue={bookingToUpdate.serviceName}
                      name="name"
                      readOnly
                    />

                    <label className="block mt-3 mb-1 text-red-500">
                      Service Image (1440px × 960px suits best)
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="text"
                      required
                      defaultValue={bookingToUpdate.serviceImage}
                      name="image"
                      readOnly
                    />

                    <label className="block mt-3 mb-1 text-red-500">
                      Service ID {'(unchangeable)'}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="text"
                      required
                      defaultValue={bookingToUpdate._id}
                      name="id"
                      readOnly
                    />

                    <label className="block mt-3 mb-1 text-red-500">
                      Provider Email {'(unchangeable)'}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="text"
                      required
                      defaultValue={bookingToUpdate.providerEmail}
                      name="providerEmail"
                      readOnly
                    />

                    <label className="block mt-3 mb-1 text-red-500">
                      Provider Name {'(unchangeable)'}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="text"
                      required
                      defaultValue={bookingToUpdate.providerName}
                      name="providerName"
                      readOnly
                    />
                  </div>
                  {/* Right side */}
                  <div className="flex-1">
                    <label className="block mt-4 mb-1 text-red-500">
                      Price in $ {'(unchangeable)'}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="text"
                      required
                      defaultValue={bookingToUpdate.servicePrice}
                      name="price"
                      readOnly
                    />

                    <label className="block mt-3 mb-1 text-red-500">
                      Your name {'(unchangeable)'}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="email"
                      required
                      name="user_email"
                      placeholder="Your email"
                      defaultValue={user?.displayName}
                      readOnly
                    />

                    <label className="block mt-3 mb-1 text-red-500">
                      Your Email {'(unchangeable)'}
                    </label>
                    <input
                      className="w-full p-2 border rounded-lg focus:outline-red-500"
                      type="email"
                      required
                      name="user_email"
                      placeholder="Your email"
                      defaultValue={user?.email}
                      readOnly
                    />

                    <label className="block mt-3 mb-1">Your instruction</label>
                    <textarea
                      className="w-full p-2 border rounded-lg focus:outline-green-500"
                      name="instruction"
                      required
                      placeholder="Enter your instruction"
                      defaultValue={bookingToUpdate.instruction}
                      cols="1"
                      rows="2"
                    />

                    <label className="block mt-1">Service taking date</label>
                    <DatePicker
                      className="w-full p-2 border rounded-lg"
                      selected={serviceTakingDate}
                      onChange={date => setServiceTakingDate(date)}
                    />
                  </div>
                </div>
                <input
                  className="mt-10 px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                  type="submit"
                  value="Update"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookedServices;