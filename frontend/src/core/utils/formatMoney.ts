export const formatMoney = (
  amount: number | string,
  params?: {delimiter?: string; unit?: string},
) => {
  const delimiter = params?.delimiter || ' '
  const unit = params?.unit ? ` ${params.unit}` : ' ₽'

  return amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, delimiter)
    .concat(unit)
}
