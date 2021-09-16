import {
  Text,
  Document,
  Page,
  Font,
  StyleSheet,
  View,
  Link
} from '@react-pdf/renderer';
import {
  FormPDFProps,
  InputSubmission,
  InputPDFProps
} from '../../@types/form';
import RadioFormPDF from './pdfElements/RadioFormPDF';
import CheckboxFormPDF from './pdfElements/CheckboxFormPDF';

export function FormPDF({
  submissionId,
  form,
  submissionResponses
}: FormPDFProps) {
  const { Form, Inputs } = form;

  function getFormComponent(input: InputPDFProps, response?: InputSubmission) {
    switch (input.type) {
      case 'radio':
        return <RadioFormPDF input={input} response={response?.response} />;
      case 'checkbox':
        return (
          <CheckboxFormPDF label={input.label} response={response?.response} />
        );
      case 'divider':
        return <View style={styles.divider} />;
      case 'link':
        return (
          <Link
            src={
              input?.options && input?.options.length > 0
                ? input?.options[0]
                : ''
            }
            style={[styles.label, styles.link]}
          >
            {input.label}
          </Link>
        );
      default:
        return (
          <View>
            <Text style={styles.label}>{input.label}</Text>
            {response && (
              <Text style={styles.response}>{response?.response}</Text>
            )}
          </View>
        );
    }
  }

  return (
    <Document>
      <Page style={styles.body}>
        <Text
          style={styles.header}
        >{`Response - Sumbmission ID ${submissionId}`}</Text>
        <View style={styles.border}>
          <View style={styles.container}>
            <Text style={styles.title}>{Form.title}</Text>
            <View style={styles.divider} />
            <Text style={styles.description}>{Form.description}</Text>
            {Inputs.map((input: InputPDFProps) => {
              const response = submissionResponses?.find(
                (res: InputSubmission) => res.inputId === input.id
              );
              return (
                <View key={input.id}>{getFormComponent(input, response)}</View>
              );
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}

Font.register({
  family: 'CircularStd',
  src: '/fonts/CircularStd-Book.otf'
});

export const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35
  },
  header: {
    fontSize: 14,
    marginBottom: 15
  },
  border: {
    border: '1px solid grey',
    borderRadius: 15,
    color: 'grey'
  },
  container: {
    padding: 10
  },
  title: {
    color: 'black',
    fontFamily: 'CircularStd',
    fontSize: 14,
    marginBottom: 10
  },
  divider: {
    borderTop: '1px solid grey',
    marginBottom: 10
  },
  description: {
    color: 'black',
    fontFamily: 'CircularStd',
    fontSize: 12,
    marginBottom: 10
  },
  label: {
    color: 'grey',
    fontFamily: 'CircularStd',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 5
  },
  response: {
    border: '1px solid grey',
    borderRadius: 5,
    color: 'grey',
    fontFamily: 'CircularStd',
    fontSize: 10,
    marginBottom: 10,
    padding: 10
  },
  link: {
    color: 'green'
  }
});
