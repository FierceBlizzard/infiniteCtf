 /**
 * TODO(developer): Uncomment and replace these variables before running the sample.
 */
const projectId = 'infinite-ctf-405100';
const zone = 'europe-central2-b'
const instanceName = 'test1'

const compute = require('@google-cloud/compute');


// Create a new instance with the values provided above in the specified project and zone.
async function createInstance(projectId, zone, instanceName) {
  const instancesClient = new compute.InstancesClient();
  const machineType = 'n1-standard-1';
  const sourceImage = 'projects/debian-cloud/global/images/family/debian-10';
  const networkName = 'global/networks/default';

  console.log(`Creating the ${instanceName} instance in ${zone}...`);

  const [response] = await instancesClient.insert({
    instanceResource: {
      name: instanceName,
      disks: [
        {
          // Describe the size and source image of the boot disk to attach to the instance.
          initializeParams: {
            diskSizeGb: '10',
            sourceImage,
          },
          autoDelete: true,
          boot: true,
          type: 'PERSISTENT',
        },
      ],
      machineType: `zones/${zone}/machineTypes/${machineType}`,
      networkInterfaces: [
        {
          // Use the network interface provided in the networkName argument.
          name: networkName,
          addressType: "EXTERNAL"
        },
      ],
    },
    project: projectId,
    zone,
  });
  let operation = response.latestResponse;
  const operationsClient = new compute.ZoneOperationsClient();

  // Wait for the create operation to complete.
  while (operation.status !== 'DONE') {
    [operation] = await operationsClient.wait({
      operation: operation.name,
      project: projectId,
      zone: operation.zone.split('/').pop(),
    });
  }

  console.log(response);
}

async function deleteInstance(projectId, zone, instanceName) {
  const instancesClient = new compute.InstancesClient();

  console.log(`Deleting ${instanceName} from ${zone}...`);

  const [response] = await instancesClient.delete({
    project: projectId,
    zone,
    instance: instanceName,
  });
  let operation = response.latestResponse;
  const operationsClient = new compute.ZoneOperationsClient();

  // Wait for the delete operation to complete.
  while (operation.status !== 'DONE') {
    [operation] = await operationsClient.wait({
      operation: operation.name,
      project: projectId,
      zone: operation.zone.split('/').pop(),
    });
  }

  console.log('Instance deleted.');
}
async function getIP(projectId, zone, instanceName){
  const compute = new Compute({projectId});
  const [instance] = await compute({projectId}).zone(zone).instance(instanceName).get();
  const networkInterfaces = instance.metadata.networkInterfaces;
  const ipAddress = networkInterfaces[0].networkIP;
  console.log(`IP: ${ipAddress}`);
}

createInstance(projectId, zone, instanceName);
//getIP(projectId, zone, instanceName);
//deleteInstance(projectId, zone, instanceName);