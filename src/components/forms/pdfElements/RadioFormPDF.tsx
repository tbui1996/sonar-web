import { Text, View, StyleSheet } from '@react-pdf/renderer';
import { styles } from '../FormPDF';
import { RadioFormPDFProps } from '../../../@types/form';

function RadioFormPDF({ input, response }: RadioFormPDFProps) {
  return (
    <View style={RadioFormPDFStyles.radioContainer}>
      <Text style={styles.label}>{input.label}</Text>
      {input?.options?.map((option: string) => (
        <View style={RadioFormPDFStyles.radioOption} key={option}>
          <View style={RadioFormPDFStyles.radio}>
            <View
              style={
                response === option ? RadioFormPDFStyles.radioSelected : {}
              }
            />
          </View>
          <Text style={styles.label}>{option}</Text>
        </View>
      ))}
    </View>
  );
}

const RadioFormPDFStyles = StyleSheet.create({
  radioContainer: {
    marginBottom: 10
  },
  radio: {
    border: '1px solid grey',
    borderRadius: '50%',
    marginRight: 10,
    height: 10,
    width: 10
  },
  radioSelected: {
    borderRadius: '50%',
    backgroundColor: 'grey',
    margin: 'auto',
    height: 7,
    padding: 2,
    width: 7
  },
  radioOption: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 5
  }
});

export default RadioFormPDF;
