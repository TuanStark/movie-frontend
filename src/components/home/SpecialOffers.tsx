export const SpecialOffers = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Special Offers</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-primary-600 to-primary-400 rounded-2xl overflow-hidden shadow-lg text-white relative">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="w-full h-full bg-[url('https://www.svgrepo.com/show/372589/ticket.svg')] bg-no-repeat bg-center transform rotate-12 scale-150"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Weekend Special</h3>
              <p className="mb-4">Get 20% off on all movie tickets this weekend!</p>
              <div className="text-3xl font-bold mb-4">SAVE20</div>
              <p className="text-sm opacity-80">Valid from Friday to Sunday. Terms apply.</p>
              <button className="mt-4 bg-white text-primary-600 font-medium py-2 px-6 rounded-full inline-block hover:bg-opacity-90 transition-all">
                Claim Offer
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-secondary-600 to-secondary-400 rounded-2xl overflow-hidden shadow-lg text-white relative">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
              <div className="w-full h-full bg-[url('https://www.svgrepo.com/show/431791/popcorn.svg')] bg-no-repeat bg-center transform rotate-12 scale-150"></div>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-bold mb-2">Combo Deal</h3>
              <p className="mb-4">Buy 2 tickets and get a free popcorn & drink!</p>
              <div className="text-3xl font-bold mb-4">COMBO2</div>
              <p className="text-sm opacity-80">For all movies. Limited time only.</p>
              <button className="mt-4 bg-white text-secondary-600 font-medium py-2 px-6 rounded-full inline-block hover:bg-opacity-90 transition-all">
                Claim Offer
              </button>
            </div>
          </div>
        </div>
      </section>
    )
}