import {FC} from 'react'
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  pdf,
} from '@react-pdf/renderer'
import {Route} from '@/core/models'
import {saveAs} from 'file-saver'
import {capitalize} from '@mui/material'

Font.register({
  family: 'Montserrat',
  src: '/fonts/Montserrat.ttf',
})

Font.register({
  family: 'Oswald',
  src: '/fonts/Oswald.ttf',
})

interface RoutePdfDocumentProps {
  route: Route
}

export const downloadRoutePdf = async (route: Route) => {
  const blob = await pdf(<RoutePdfDocument route={route} />).toBlob()
  saveAs(
    blob,
    `${route.name
      .split(' ')
      .map(w => capitalize(w))
      .join('')}.pdf`,
  )
}
export const RoutePdfDocument: FC<RoutePdfDocumentProps> = ({route}) => {
  return (
    <Document>
      <Page size='A4' style={s.page}>
        <View style={s.section}>
          <Text style={s.mainHeader}>{route.name}</Text>
        </View>

        {route.customProperties?.listDescription?.length ? (
          <View style={s.section}>
            <Text style={s.subHeader}>Описание маршрута</Text>

            {route.customProperties.listDescription.map((item, index) => (
              <View key={item.title} style={s.section}>
                <Text style={s.listItemHeader}>
                  {index + 1}. {item.title}
                </Text>
                <Text>{item.text}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {route.stops.length ? (
          <View style={s.section}>
            <Text style={s.subHeader}>Маршрут</Text>

            {route.stops.map((stop, index) => (
              <View key={stop.id} style={s.routeStop}>
                <Text style={s.listItemHeader}>
                  {index + 1}. {stop.attraction.name}
                </Text>
                <Text>{stop.attraction.description}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {route.customProperties?.toTakeWithYou?.length ? (
          <View style={s.section}>
            <Text style={s.subHeader}>Что взять с собой</Text>

            {route.customProperties.toTakeWithYou.map(take => (
              <View key={take.title} style={s.section}>
                <Text style={s.listItemHeader}>{take.title}</Text>
                {take.items.map((item, index) => (
                  <Text key={item}>
                    {index + 1}. {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        <View style={[s.section, s.infoSection]}>
          <Text style={s.infoHeader}>
            Рекомендуем пройти консультацию перед прохождением маршрута в
            Туристско-информационном центре.
          </Text>

          <View style={s.row}>
            <Text style={[s.infoSubheader, s.rowCell]}>
              Туристско-информационный центр Домбай «Katadze»
            </Text>
            <Text style={[s.infoSubheader, s.rowCell]}>
              Туристско-информационный центр Архыз
            </Text>
          </View>

          <View style={s.row}>
            <Text style={[s.rowCell, s.infoText]}>
              Адрес: кп. Домбай, Карачаевская улица, 101в, 1 этаж тел:
              +7‒928‒032‒22‒21
            </Text>
            <Text style={[s.rowCell, s.infoText]}>
              Адрес: Горная ул., 1, посёлок Романтик, село Архыз тел:8 (800)
              100-55-59
            </Text>
          </View>

          <View>
            <Text style={[s.infoSubheader]}>
              Там вы сможете получить полную информацию по:
            </Text>
          </View>

          <View>
            <Text style={[s.infoText]}>- сложности маршрута;</Text>
            <Text style={[s.infoText]}>- необходимости регистрации в МЧС;</Text>
            <Text style={[s.infoText]}>
              - необходимости в пропуске на пограничную зону;
            </Text>
            <Text style={[s.infoText]}>
              - подбору гидов и прокатов на месте;
            </Text>
            <Text style={[s.infoText]}>
              - медицинским ограничением для прохождения маршрутов;
            </Text>
            <Text style={[s.infoText]}>
              - и др. консультации по маршрутам и турам.
            </Text>
          </View>

          <View>
            <Text style={[s.infoSubheader]}>Телефоны экстренных служб</Text>
          </View>

          <View>
            <Text style={[s.infoText]}>Скорая помощь: 03, 103, 030</Text>
            <Text style={[s.infoText]}>МВД: 02, 102, 020</Text>
            <Text style={[s.infoText]}>МЧС: 010</Text>
            <Text style={[s.infoText]}>
              Поисково-спасательный отряд: +7 (8782) 23-90-60
            </Text>
          </View>

          <View style={s.row}>
            <Text style={[s.rowCell, s.infoSubheader]}>Архыз</Text>
            <Text style={[s.rowCell, s.infoSubheader]}>Домбай</Text>
            <Text style={[s.rowCell, s.infoSubheader]}>Теберда</Text>
          </View>

          <View style={s.row}>
            <View style={[s.rowCell, s.section]}>
              <Text style={[s.infoText]}>Медпункт +7 (938) 038-94-49</Text>
              <Text style={[s.infoText]}>МВД +7 (999) 490-33-24</Text>
              <Text style={[s.infoText]}>МЧС +7 (928) 398-37-11</Text>
              <Text style={[s.infoText]}>ПСП +7 (928) 396-47-87</Text>
            </View>
            <View style={[s.rowCell, s.section]}>
              <Text style={[s.infoText]}>Медпункт +7 (87872) 58-26-33</Text>
              <Text style={[s.infoText]}>МВД +7 (999) 490-33-74</Text>
              <Text style={[s.infoText]}>МЧС +7 (87872) 58-138</Text>
              <Text style={[s.infoText]}>
                ПСП на склонах Мусса-Ачитар +7 (928) 028-64-63
              </Text>
            </View>
            <View style={[s.rowCell, s.section]}>
              <Text style={[s.infoText]}>Медпункт +7 (87879) 5-27-68</Text>
              <Text style={[s.infoText]}>МВД +7 (999) 490-33-95</Text>
              <Text style={[s.infoText]}>МЧС +7 (87879) 5-27-72</Text>
              <Text style={[s.infoText]}>ПСП +7 (87879) 5-81-38</Text>
            </View>
          </View>

          <Text style={s.infoHeader}>
            Обязательно в случае повышенной сложности маршрута необходимо
            зарегистрироваться в местном отделении МЧС перед началом прохождения
            маршрута.
          </Text>

          <Text style={s.infoHeader}>
            Если маршрут проходит по пограничной зоне - необходимо взять пропуск
            пограничную зону КЧР.
          </Text>
        </View>
      </Page>
    </Document>
  )
}

const s = StyleSheet.create({
  page: {
    fontFamily: 'Montserrat',
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    fontSize: 12,
    gap: 10,
    padding: 40,
    fontWeight: 'normal',
  },
  mainHeader: {
    fontFamily: 'Oswald',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subHeader: {
    fontFamily: 'Oswald',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listItemHeader: {
    fontFamily: 'Oswald',
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    gap: 10,
  },
  routeStop: {
    flexDirection: 'column',
    gap: 5,
  },
  infoSection: {
    marginTop: 50,
    border: '1px solid black',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowCell: {
    flex: 1,
  },
  infoHeader: {
    fontFamily: 'Oswald',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoSubheader: {
    fontFamily: 'Oswald',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 10,
  },
})
