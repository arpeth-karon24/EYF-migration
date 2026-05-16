import { EVENT_CATEGORIES, EVENT_TYPES } from "@/constants/eventFilters";

export function HomeEventsSection() {
  return (
    <section className="bg-eyf-page py-16 lg:py-24" aria-labelledby="choose-events-heading">
      <div className="mx-auto max-w-container px-4">
        <div className="text-center">
          <h2 id="choose-events-heading" className="mb-12 font-poppins text-3xl font-bold text-white lg:text-[40px]">
            Choose Events
          </h2>
        </div>
        <div className="mx-auto max-w-5xl">
          <form className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" action="#" method="get" role="search">
            <div className="flex flex-col gap-1">
              <input
                id="search_keywords"
                name="search_keywords"
                type="text"
                placeholder="Keywords"
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-eyf-gold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <input
                id="search_location"
                name="search_location"
                type="text"
                placeholder="Location"
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-eyf-gold"
              />
            </div>
            <div className="flex flex-col gap-1">
              <input
                id="search_datetimes"
                name="search_datetimes"
                type="text"
                placeholder="Select Date Range"
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 placeholder-gray-400 outline-none transition-all focus:border-eyf-gold"
                readOnly
              />
            </div>
            <div className="flex flex-col gap-1 lg:col-span-2">
              <select
                id="search_categories"
                name="search_categories"
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 outline-none transition-all focus:border-eyf-gold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
              >
                <option value="">Choose an Event Category</option>
                {EVENT_CATEGORIES.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <select
                id="search_event_types"
                name="search_event_types"
                className="w-full rounded border border-white/20 bg-white px-4 py-3 text-[13px] text-gray-700 outline-none transition-all focus:border-eyf-gold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23999999%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:10px] bg-[right_1rem_center] bg-no-repeat"
              >
                <option value="">Choose an Event Type</option>
                {EVENT_TYPES.map((o) => (
                  <option key={o.label} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </form>
          
          <div className="mt-12 rounded-lg border border-[#f5c6cb] bg-[#f8d7da] px-6 py-4 text-center text-[13px] font-normal text-[#721c24]">
            There are currently no events.
          </div>
        </div>
      </div>
    </section>
  );
}
