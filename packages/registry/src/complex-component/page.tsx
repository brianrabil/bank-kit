import { PokemonCard } from "@bank-kit/registry/complex-component/components/pokemon-card";
import { getPokemonList } from "@bank-kit/registry/complex-component/lib/pokemon";
import { cache } from "react";

const getCachedPokemonList = cache(getPokemonList);

export default async function Page() {
	const pokemons = await getCachedPokemonList({ limit: 12 });

	if (!pokemons) {
		return null;
	}

	return (
		<div className="mx-auto w-full max-w-2xl px-4">
			<div className="grid grid-cols-2 gap-4 py-10 sm:grid-cols-3 md:grid-cols-4">
				{pokemons.results.map((p) => (
					<PokemonCard key={p.name} name={p.name} />
				))}
			</div>
		</div>
	);
}
