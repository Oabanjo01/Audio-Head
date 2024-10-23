import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text } from "react-native";
import CustomWrapper from "root/components/customScrollableWrapper";

const EditProfile = () => {
  const params: { title: string } = useLocalSearchParams();
  const { title } = params;

  return (
    <CustomWrapper>
      <Text>EditProfile</Text>
    </CustomWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({});

// import { Formik, FormikProps } from "formik";
// import React, { useRef } from "react";
// import { StyleSheet, View } from "react-native";
// import Button from "root/components/auth/Button";
// import TextField from "root/components/auth/TextField";
// import CustomWrapper from "root/components/customScrollableWrapper";
// import { height, width } from "root/constants/Dimensions";
// // import * as yup from 'yup';

// const EditProfile = () => {
//   const formikRef = useRef<FormikProps<any> | null>(null);
//   return (
//     <CustomWrapper title="Edit Profile" leftHeaderIcon>
//       <Formik
//         innerRef={formikRef}
//         initialValues={{}}
//         // validationSchema={createProductSchema}
//         onSubmit={async (values) => {}}
//       >
//         {({
//           handleSubmit,
//           errors,
//           touched,
//           setFieldValue,
//           isValidating,
//           isValid,
//           handleChange,
//           values,
//         }) => {
//           console.log(values);
//           return (
//             <>
//               <View style={{ paddingHorizontal: width * 0.035 }}>
//                 {/* <View style={{ flexDirection: "row", marginBottom: 10 }}>
//                     <Pressable
//                       style={styles.addImageBox}
//                       onPress={async () => {
//                         const response = await pickImage();
//                         if (!response) return;

//                         const imageList = response?.map((image) => {
//                           return image.uri;
//                         });
//                         if (images.length + imageList.length > 5) {
//                           return showToast({
//                             text1: `Too many images selected`,
//                             text2: `Image length exceeds 5`,
//                             type: `info`,
//                             position: "top",
//                           });
//                         }
//                         setImages([...images, ...imageList]);
//                         setFieldValue("images", [...images, ...imageList]);
//                       }}
//                     >
//                       <Text style={{ flexWrap: "wrap" }}>Add Images</Text>
//                     </Pressable>
//                     <View style={{ flex: 1 }}>
//                       <FlatList
//                         data={images}
//                         horizontal
//                         renderItem={({ item, index }) => {
//                           return (
//                             <Pressable
//                               onLongPress={() => {
//                                 setSelectedImage(item);
//                                 handlePresentImageModalPress();
//                               }}
//                             >
//                               <Image
//                                 source={{ uri: item }}
//                                 style={styles.image}
//                               />
//                             </Pressable>
//                           );
//                         }}
//                       />
//                     </View>
//                   </View> */}
//                 <TextField
//                   label="Name"
//                   leftIconTitle="bag-outline"
//                   maxLength={12}
//                   leftIcon
//                   viewProps={{
//                     paddingVertical: 15,
//                     marginBottom: 10,
//                   }}
//                   values={values.name}
//                   autoCapitalize="none"
//                   secureTextEntry={false}
//                   setFieldValue={setFieldValue}
//                   fieldName="name"
//                   error={errors.name && isValid ? true : false}
//                   // errorMessage={errors.name}
//                 />
//               </View>
//               <Button
//                 buttonStyle={{
//                   marginTop: height * 0.05,
//                   alignSelf: "center",
//                   paddingVertical: 10,
//                 }}
//                 // disabled={!isValid || images.length === 0}
//                 // onPress={handleSubmit}
//                 label={"Create"}
//               />
//             </>
//           );
//         }}
//       </Formik>
//     </CustomWrapper>
//   );
// };

// export default EditProfile;

// const styles = StyleSheet.create({});
