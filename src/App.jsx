import { useDispatch, useSelector } from 'react-redux'
import { useGetManufacturersQuery, useGetOffersQuery } from './api'
import BrandList from './components/BrandList'
import Loader from './components/Loader'
import Message from './components/Message'
import OffersTable from './components/OffersTable'
import SearchForm from './components/SearchForm'
import { errorText, manufacturersFromGoods } from './format'
import { setBrand } from './searchSlice'

export default function App() {
  const dispatch = useDispatch()
  const article = useSelector((state) => state.search.article)
  const brand = useSelector((state) => state.search.brand)
  const manufacturersQuery = useGetManufacturersQuery(article, { skip: !article })
  const offersQuery = useGetOffersQuery({ number: article, brand }, { skip: !article || !brand })

  const manufacturers = manufacturersFromGoods(manufacturersQuery.data?.items || [])
  const manufacturerError =
    manufacturersQuery.data?.error || (manufacturersQuery.isError ? errorText(manufacturersQuery.error) : '')
  const offers = offersQuery.data?.rows || []
  const offersError = offersQuery.data?.error || (offersQuery.isError ? errorText(offersQuery.error) : '')

  return (
    <main className="container py-4">
      <div className="mb-4">
        <h1 className="h3 mb-1">Подбор автозапчастей</h1>
        <p className="text-secondary mb-0">Сначала выберите производителя по артикулу, затем смотрите аналоги и предложения.</p>
      </div>

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="h5">1. Поиск производителей</h2>
          <SearchForm />
          {article && manufacturersQuery.isFetching ? <Loader text="Ищем производителей…" /> : null}
          {article && !manufacturersQuery.isFetching && manufacturerError ? (
            <div className="mt-3">
              <Message variant="danger">{manufacturerError}</Message>
            </div>
          ) : null}
          {article && !manufacturersQuery.isFetching && !manufacturerError && manufacturers.length === 0 && manufacturersQuery.isSuccess ? (
            <div className="mt-3">
              <Message>По этому артикулу ничего не найдено.</Message>
            </div>
          ) : null}
          {manufacturers.length > 0 && !manufacturerError ? (
            <div className="mt-3">
              <BrandList items={manufacturers} selectedBrand={brand} onSelect={(nextBrand) => dispatch(setBrand(nextBrand))} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="card shadow-sm">
        <div className="card-body">
          <h2 className="h5">2. Аналоги и предложения</h2>
          {!brand ? <Message>Выберите производителя, чтобы получить аналоги.</Message> : null}
          {brand && offersQuery.isFetching ? <Loader text="Загружаем аналоги и предложения…" /> : null}
          {brand && !offersQuery.isFetching && offersError ? <Message variant="danger">{offersError}</Message> : null}
          {brand && !offersQuery.isFetching && !offersError && offers.length === 0 && offersQuery.isSuccess ? (
            <Message>Аналоги и предложения не найдены.</Message>
          ) : null}
          {brand && !offersError && offers.length > 0 ? (
            <>
              <p className="text-secondary">
                {brand}, артикул {article}. Найдено позиций: {offers.length}. Цена — минимальная среди складов с остатком.
              </p>
              <OffersTable rows={offers} />
            </>
          ) : null}
        </div>
      </section>
    </main>
  )
}
