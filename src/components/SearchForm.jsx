import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setArticle } from '../searchSlice'

export default function SearchForm() {
  const dispatch = useDispatch()
  const article = useSelector((state) => state.search.article)
  const [value, setValue] = useState(article)

  useEffect(() => {
    const next = value.trim()
    if (next === article) return undefined
    const timer = window.setTimeout(() => {
      dispatch(setArticle(next))
    }, 400)
    return () => window.clearTimeout(timer)
  }, [article, dispatch, value])

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        dispatch(setArticle(value.trim()))
      }}
    >
      <label className="form-label" htmlFor="article">
        Артикул
      </label>
      <div className="input-group">
        <input
          id="article"
          className="form-control"
          value={value}
          placeholder="Например, 01089"
          autoComplete="off"
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="btn btn-primary" type="submit">
          Найти
        </button>
      </div>
    </form>
  )
}
