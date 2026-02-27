import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Search } from 'lucide-react';
import { MobileNav } from '../components/MobileNav';
import { Header } from '../components/Header';

const Recipes: React.FC = () => {
  const navigate = useNavigate();

  const categories = ['All', 'Desserts', 'Main Courses', 'Drinks', 'Breakfast', 'Snacks'];

  const recipes = [
    {
      title: "Honey Lavender Cheesecake",
      description: "Silky smooth cheesecake with a floral honey aroma.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYKgx7Z7-SmXQ5CKaSIiiBAWGr6AJbzqC_9Aq3A9XDYRmo5LKTQKe05EVhOghD49_LMKmc4VEwSC4zCfNRdsCEFX-b9fCQfmMBaOYW7vts3l8IBT2HKbGG2KKZZOFvOuwcGxElc88cauoD9iuQS7KOrZJzpmZIyV6WhDNQaJMlm_b-lLc2C3SLtIyn6033BwACaTm5SyrDuf3XxrQLfD9EPV8PTP5Y2RQKwvxZ83fa12CTS0y8ktpOr8JfsiQnIT0KncHgJdfizdNb"
    },
    {
      title: "Spicy Honey Glazed Salmon",
      description: "Pan-seared salmon with a sweet and spicy honey glaze.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAbIYXe4QKJVGTtjiXcT6KD-Q3VK9C1TFUeUaIHUj1QTjX3OEEFhb0ziyCDuxAK57wLFhPkcQVFk3QI_OXfJmvMqoKg_WS7rtfzp_rS6DXrzAN_GW3HFwGB9DPxq3WyL7nphWqkJXV_tbD09CSYGb2Vr7dUJXrn96Pm7nFor9YXguHV4qhOELrc1LWi-C4izHn2VNEouS_X40nazFCkXby-OlAVT02h2Yb2UwAMoS_h8OQStaPYQDUJHxAXRrAYJCVQFjVW2pPCo1PQ"
    },
    {
      title: "Golden Honey Lemonade",
      description: "Refreshing homemade lemonade sweetened with pure honey.",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAfKB0GWamPqgbIGbwb5LXEaIGcSJjFHXA1mJ0-opSchxhTrdgsdAMDwHn7tKvAyExC0HuzU2gcoFSdWS_Fa_KEzncCgcIzmA66-_cy8it_Frr8gn1i6Ouz89HlzdzXLNW94mrBJtM-I5VXRs4gHxH-R44PWFJb7KFEsK_lyGn8s7HyderGrzOucVts_a18gNK5dAcbb3CBTD1BCu_6cM2eLjDQ31lZzAYHpQXSKN_RqmNkJU4gPHYHkqBhstd9mM74X_zhMKUGeTIP"
    }
  ];

  return (
    <div className="min-h-screen font-sans pb-24">
      {/* Desktop Header - Visible on larger screens */}
      <div className="hidden md:block">
        <Header />
      </div>

      <div className="md:container md:mx-auto md:max-w-6xl" style={{
        backgroundImage: "url('/assets/beemanhoney_recipes_page.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh'
      }}>
        <header className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 shadow-sm">
          <button onClick={() => navigate(-1)} aria-label="Go back">
            <ChevronLeft className="h-6 w-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 font-serif">BeeManHoney Recipes</h1>
          <button aria-label="Search">
            <Search className="h-6 w-6 text-gray-800" />
          </button>
        </header>

        <main className="p-4 md:container md:mx-auto md:max-w-6xl lg:p-6">
          {/* Filters */}
          <section className="mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2 no-scrollbar">
              {categories.map((cat, i) => (
                <button
                  key={cat}
                  className={`inline-block flex-shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-colors ${i === 0 ? 'bg-[#B98E2A] text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Search */}
          <section className="mb-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                className="block w-full rounded-lg border border-gray-200 bg-white p-3 pl-10 text-sm text-gray-900 focus:border-[#B98E2A] focus:ring-[#B98E2A] outline-none"
                placeholder="Search for recipes..."
                type="search"
              />
            </div>
          </section>

          {/* List */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe, idx) => (
              <article key={idx} className="overflow-hidden rounded-xl bg-white shadow-md">
                <img src={recipe.image} alt={recipe.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{recipe.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{recipe.description}</p>
                    </div>
                    <button className="w-full rounded-lg bg-[#B98E2A] px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-opacity-90">
                      View Recipe
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
      <MobileNav />
    </div>
  );
};

export default Recipes;