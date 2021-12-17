export type File = {
  id: number;
  fileId: string;
  fileName: string;
  filePath: string;
  fileMimetype: string;
  memberId: string;
  sendUserId: string;
  dateUploaded: string;
  dateLastAccessed?: string;
  DeletedAt?: string;
  chatId: string;
};

export type FormToAssociateProps = {
  data: File;
  setOpen: (val: boolean) => void;
  handleTableDisplay?: (id: string) => void;
  updateData: (val: File) => void;
};
