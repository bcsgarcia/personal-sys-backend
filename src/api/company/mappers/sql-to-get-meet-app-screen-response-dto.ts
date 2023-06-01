import { GetMeetAppScreenResponseDto } from '../dto/response/response';

export function mapperSqlResultToResponseObject(
  sqlResult: any[],
): GetMeetAppScreenResponseDto {
  const response: GetMeetAppScreenResponseDto = {
    aboutCompany: {
      imageUrl: '',
      description: '',
      videoUrl: '',
    },
    testemonies: [],
    photosBeforeAndAfter: [],
  };

  sqlResult.forEach((row) => {
    if (!response.aboutCompany.description) {
      response.aboutCompany.description = row.aboutCompany_description;
    }

    if (!response.aboutCompany.imageUrl) {
      response.aboutCompany.imageUrl = row.aboutCompany_imageUrl;
    }

    if (!response.aboutCompany.videoUrl) {
      response.aboutCompany.videoUrl = row.aboutCompany_videoUrl;
    }

    if (row.testimonies_imageUrl) {
      const testimony: Testimony = {
        imageUrl: row.testimonies_imageUrl,
        name: row.testimonies_name,
        description: row.testimonies_description,
      };
      response.testemonies.push(testimony);
    }

    if (row.photosBeforeAndAfter_imageUrl) {
      response.photosBeforeAndAfter.push(row.photosBeforeAndAfter_imageUrl);
    }
  });

  return response;
}
