import { Text, View, Svg, Path, StyleSheet } from '@react-pdf/renderer';
import { styles } from '../FormPDF';
import { CheckboxFormPDFProps } from '../../../@types/form';

function CheckboxFormPDF({ label, response }: CheckboxFormPDFProps) {
  return (
    <View style={CheckboxFormPDFStyles.checkboxOption}>
      <View style={CheckboxFormPDFStyles.checkbox}>
        {response === 'Yes' && (
          <Svg viewBox="0 0 24 24" width="10" height="10">
            <Path
              d="M1.73 12.91l6.37 6.37L22.79 4.59"
              stroke="grey"
              strokeWidth={3}
            />
          </Svg>
        )}
      </View>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export const CheckboxFormPDFStyles = StyleSheet.create({
  checkbox: {
    border: '1px solid grey',
    borderRadius: 3,
    marginRight: 10,
    height: 10,
    width: 10
  },
  checkboxOption: {
    alignItems: 'baseline',
    flexDirection: 'row',
    marginBottom: 10
  }
});

export default CheckboxFormPDF;
